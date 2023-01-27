import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {CreateNewsDto} from "../../dto/create-news.dto";
import {NewsEntity} from "../../entities/news.entity";
import {UpdateNewsDto} from "../../dto/update-news.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {CommentsService} from "./comments/comments.service";
import {UsersEntity} from "../../entities/users.entity";
import {redis} from "../app.module";


@Injectable()
export class NewsService {
  constructor(@InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
              @Inject(forwardRef(() => UsersService))
              private readonly usersService: UsersService,
              private readonly commentsService: CommentsService
  ) {
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<NewsEntity> {
    const _user = await this.usersService.getUserById(createNewsDto.userId);
    if (!_user) {
      throw new HttpException(
        'Не существует такого автора', HttpStatus.BAD_REQUEST,
      );
    }

    const newsEntity = new NewsEntity();
    newsEntity.title = createNewsDto.title;
    newsEntity.description = createNewsDto.description;
    newsEntity.createdAt = new Date();
    newsEntity.updatedAt = new Date();
    newsEntity.cover = createNewsDto.cover;
    newsEntity.user = _user;
    redis.zincrby("users", 1, `${_user.lastName} ${_user.firstName}`);
    return await this.newsRepository.save(newsEntity);
  }

  async findAll() {
    console.log(await redis.keys('all-news'));
    console.log(await redis.zrevrange("users", 0, 9, "WITHSCORES"));
    const cachedData: string = await redis.get('all-news');
    if (cachedData) {
      console.log("Data from cash:");
      console.log(cachedData);
      return JSON.parse(cachedData);
    }
    const news = await this.newsRepository.find({relations: ['comments', 'user', 'comments.user']});
    await redis.set('all-news', JSON.stringify(news), "EX", 180, () => {
      console.log('Data were written to cache')
    });
    return news;

  }

  async findAllByUser(user: UsersEntity) {
    return await this.newsRepository.find({
      where: {
        user
      }
    });
  }

  async findOneNews(id: number): Promise<NewsEntity> {
    const news = await this.newsRepository.findOne({
      where: {
        id,
      },
      relations: ['comments', 'user', 'comments.user'],
    });

    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }


  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<NewsEntity> {
    const news = await this.newsRepository.findOne({
      where: {
        id,
      },
    });

    if (!news) {
      throw new NotFoundException();
    }
    const updatedNews = {
      ...news,
      title: updateNewsDto.title ? updateNewsDto.title : news.title,
      description: updateNewsDto.description ? updateNewsDto.description : news.description,
      updatedAt: new Date()
    };
    await this.newsRepository.save(updatedNews);
    return updatedNews;
  }


  async remove(id: number): Promise<NewsEntity[]> {
    const news = await this.newsRepository.findOneBy({id});
    if (!news) {
      throw new NotFoundException();
    }
    await this.newsRepository.remove(news);
    return await this.newsRepository.find();
  }

  async removeAll(): Promise<NewsEntity[]> {
    const news = await this.newsRepository.find();
    for (const item of news) {
      await this.newsRepository.remove(item);
    }

    return await this.newsRepository.find();
  }
}
