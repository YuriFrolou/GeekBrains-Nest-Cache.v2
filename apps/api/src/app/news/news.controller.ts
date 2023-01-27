import {
  Body, CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL,
  Controller,
  Delete,
  Get, Header, Headers, HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Render, Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {NewsService} from "./news.service";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {HelperFileLoad} from "../../utils/HelperFileLoad";
import {CreateNewsDto} from "../../dto/create-news.dto";
import {NewsEntity} from "../../entities/news.entity";
import {UpdateNewsDto} from '../../dto/update-news.dto';
import {v4 as uuidv4} from 'uuid';
import {Response} from 'express';

const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@ApiTags('news')
@Controller('news')
export class NewsController {
  private cashNews: NewsEntity[] | null = null;
  private eTag: string = uuidv4();

  constructor(private readonly newsService: NewsService) {
  }

  @Post()
  @ApiBody({type: CreateNewsDto})
  @ApiResponse({
    status: 201,
    description: 'create new news',
    type: NewsEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async create(@Body() createNewsDto: CreateNewsDto, @UploadedFile() cover: Express.Multer.File = null): Promise<NewsEntity> {
    if (cover?.filename) {
      createNewsDto.cover = PATH_NEWS + cover.filename;
    }
    this.cashNews = null;
    this.eTag = uuidv4();
    return await this.newsService.createNews(createNewsDto);
  }


  @Get()
  @ApiResponse({
    status: 200,
    description: 'get all news',
    type: [NewsEntity],
  })
  @Header('Access-Control-Expose-Headers', 'etag')
  async findAll(@Headers() headers: ParameterDecorator, @Res({passthrough: true}) res: Response) {

    if (headers['if-none-match'] && this.eTag && headers['if-none-match'] === this.eTag) {
      return res.status(HttpStatus.NOT_MODIFIED).end();
    }

    if (!this.cashNews) {
      this.cashNews = await this.newsService.findAll();
      res.setHeader('etag', this.eTag);
      res.status(HttpStatus.OK);
    }
    return this.cashNews;

  }


  @Get('/detail/:id')
  @ApiTags('news')
  @ApiResponse({
    status: 200,
    description: 'get news by id',
    type: NewsEntity,
  })
  async findOne(@Param('id') id: number): Promise<NewsEntity> {
    return await this.newsService.findOneNews(id);
  }

  @Patch(':id')
  @ApiTags('news')
  @ApiBody({type: UpdateNewsDto})
  @ApiResponse({
    status: 200,
    description: 'update news',
    type: NewsEntity,
  })
  async update(@Param('id') id: number, @Body() updateNewsDto: UpdateNewsDto): Promise<NewsEntity> {
    this.cashNews = null;
    this.eTag = uuidv4();
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiTags('news')
  @ApiResponse({
    status: 200,
    description: 'delete news by id',
    type: [NewsEntity],
  })
  async remove(@Param('id') id: number): Promise<NewsEntity[]> {
    this.cashNews = null;
    this.eTag = uuidv4();
    return await this.newsService.remove(id);
  }

  @Delete()
  @ApiTags('news')
  @ApiResponse({
    status: 200,
    description: 'delete all news',
    type: [NewsEntity],
  })
  async removeAll(): Promise<NewsEntity[]> {
    return await this.newsService.removeAll();
  }
}
