import {
  CACHE_MANAGER,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CommentsEntity} from "../../../entities/comments.entity";
import {Repository} from "typeorm";
import {NewsService} from "../news.service";
import {UsersService} from "../../users/users.service";
import {CreateCommentDto} from "../../../dto/create-comment.dto";
import {Cache} from "cache-manager";
import {NewsEntity} from "../../../entities/news.entity";


@Injectable()
export class CommentsService {

  constructor(@InjectRepository(CommentsEntity)
              private readonly commentRepository: Repository<CommentsEntity>,
              @Inject(forwardRef(() => NewsService))
              private readonly newsService: NewsService,
              private readonly usersService: UsersService,
              @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
  }

  async create(createCommentDto: CreateCommentDto): Promise<CommentsEntity> {
    const _news = await this.newsService.findOneNews(createCommentDto.newsId);
    const _user = await this.usersService.getUserById(createCommentDto.userId);

    if (!_user) {
      throw new HttpException(
        'Не существует такого автора', HttpStatus.BAD_REQUEST,
      );
    }
    if (!_news) {
      throw new HttpException(
        'Не существует такой новости', HttpStatus.BAD_REQUEST,
      );
    }

    const comment = new CommentsEntity();
    comment.message = createCommentDto.message;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    comment.user = _user;
    comment.news = _news;

    const newComment = await this.commentRepository.save(comment);
    console.log(newComment)
    return this.commentRepository.findOne({
      where: {id: newComment.id},
      relations: ['news', 'user']
    })

  }


  async findAll(newsId: number): Promise<CommentsEntity[]> {

    const cachedData: CommentsEntity[] = await this.cacheService.get('comments');
    if (cachedData) {
      console.log('Data from cache');
      console.log(cachedData);
      return cachedData;
    }
    const comments = await this.commentRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: ['user'],
    });
    await this.cacheService.set('comments', comments);
    return comments;
  }

  async findOne(id: number): Promise<CommentsEntity> {
    const comment = await this.commentRepository.findOne({
      where: {id},
      relations: ['news', 'user']
    });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async update(commentId: number, message: string): Promise<CommentsEntity> {
    let _comment = await this.findOne(commentId);
    const updatedComment = {
      ..._comment,
      message: message ? message : _comment.message,
      updatedAt: new Date()
    };
    await this.commentRepository.save(updatedComment);
    return this.commentRepository.findOne({
      where: {id: commentId},
      relations: ['news', 'user']
    })
  }

  async remove(commentId: number): Promise<number> {
    const comment = await this.findOne(commentId);
    await this.commentRepository.remove(comment);
    return commentId;
  }
}
