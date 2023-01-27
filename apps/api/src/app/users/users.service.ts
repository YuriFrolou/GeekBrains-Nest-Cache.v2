import {CACHE_MANAGER, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "../../entities/users.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "../../dto/create-user.dto";
import {UpdateUserDto} from "../../dto/update-user.dto";
import {compare, hash} from "../../utils/crypto";
import {Cache} from "cache-manager";
import {NewsService} from "../news/news.service";
import {redis} from "../app.module";


@Injectable()
export class UsersService {

  constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
              @Inject(CACHE_MANAGER) private cacheService: Cache,
              @Inject(forwardRef(() => NewsService))
              private readonly newsService: NewsService
  ) {
  }

  async createUser(createUserDto: CreateUserDto):Promise<UsersEntity> {
    const user = new UsersEntity();
    user.firstName= createUserDto.firstName;
    user.lastName= createUserDto.lastName;
    user.email= createUserDto.email;
    user.cover = createUserDto.cover;
    user.password = await hash(createUserDto.password);
    user.createdAt= new Date();
    user.updatedAt= new Date();
    redis.zadd("users",0,`${user.lastName} ${user.firstName}`)
    return await this.usersRepository.save(user);
  }

  async getUsers():Promise<UsersEntity[]> {
    console.log(await this.cacheService.store.keys("*"));
    const cachedData:UsersEntity[] = await this.cacheService.get(
      'all-users',
    );
    if (cachedData) {
      console.log("Data from cache");
      console.log(cachedData);
      return cachedData;
    }
    const users= await this.usersRepository.find();
    await this.cacheService.set('all-users', users,180);
    return users;
  }

  async getUserById(id: number):Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByEmail(email): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: {
        email
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto):Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ id });


    user.firstName= updateUserDto.firstName?updateUserDto.firstName : user.firstName;
    user.lastName=updateUserDto.lastName? updateUserDto.lastName : user.lastName;
    user.email= updateUserDto.email?updateUserDto.email : user.email;
    user.password= updateUserDto.password ? await hash(updateUserDto.password) : user.password;
    user.cover= updateUserDto.cover?updateUserDto.cover:user.cover;
    user.updatedAt= new Date();


    return await this.usersRepository.save(user);
  }


  async removeUser(id: number):Promise<UsersEntity[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    const news=await this.newsService.findAllByUser(user);
    for(const item of news){
      await this.newsService.remove(item.id);
    }
    await this.usersRepository.remove(user);
    return await this.usersRepository.find();
  }

  async login(email:string,password:string):Promise<number> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if (user && (await compare(password, user.password))) {
      return user.id;
    }
    return 0;
  }
  }

