import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Req, Res,
  UploadedFile,
  UseInterceptors, Request, CacheInterceptor, CacheTTL
} from '@nestjs/common';
import {HelperFileLoad} from "../../utils/HelperFileLoad";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./users.service";
import {CreateUserDto} from "../../dto/create-user.dto";
import {UsersEntity} from "../../entities/users.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {UpdateUserDto} from "../../dto/update-user.dto";
import {Response} from "express";

const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiOperation({summary:'Create user'})
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'create user',
    type: UsersEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() cover: Express.Multer.File): Promise<UsersEntity> {
    if (cover?.filename) {
      createUserDto.cover = PATH_NEWS + cover.filename;
    } else {
      createUserDto.cover = 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    }

    return await this.usersService.createUser(createUserDto);
  }

  @Get('/login')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'login in browser',
  })
  @Render('user-login')
  async loginUser() {
  }

  @Get('/update/:id')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'update profile in browser',
  })
  @Render('user-update')
  async updateUserOnBrowser(@Param('id') id: number) {
    const _user = await this.usersService.getUserById(id);
    return {
      user:_user
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: [UsersEntity],
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(180)
  async getUsers(): Promise<UsersEntity[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'get user by id',
    type: UsersEntity,
  })
  async getUser(@Req() request, @Param('id') id: number): Promise<UsersEntity> {
    console.log(request.headers);
    return await this.usersService.getUserById(id);
  }


  @Patch()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'update user',
    type: UsersEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async updateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto,@UploadedFile() cover: Express.Multer.File): Promise<UsersEntity> {

    if (cover?.filename) {
      updateUserDto.cover = PATH_NEWS + cover.filename;
    }
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'delete user',
    type: [UsersEntity],
  })
  async removeUser(@Param('id') id: number): Promise<UsersEntity[]> {
    return await this.usersService.removeUser(id);
  }

  @Post('/auth')
  async login(@Body() data:{email:string,password:string}):Promise<number> {
    return  await this.usersService.login(data.email,data.password);
  }
}

