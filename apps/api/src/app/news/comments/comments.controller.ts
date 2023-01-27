import {
  Body,
  CacheInterceptor, CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UseInterceptors
} from '@nestjs/common';
import {CommentsService} from "./comments.service";
import {UsersService} from "../../users/users.service";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateCommentDto} from "../../../dto/create-comment.dto";
import {CommentsEntity} from "../../../entities/comments.entity";
import {UpdateCommentDto} from "../../../dto/update-comment.dto";


@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
              private readonly usersService: UsersService) {
  }

  @Post()
  @ApiTags('comments')
  @ApiBody({type: CreateCommentDto})
  @ApiResponse({
    status: 201,
    description: 'create new comment',
    type: CommentsEntity
  })

  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentsEntity> {
    return await this.commentsService.create(createCommentDto);
  }


  @Get('/:newsId')
  @ApiTags('comments')
  @ApiResponse({
    status: 200,
    description: 'get all comments by news id',
    type: [CommentsEntity]
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(180)
  async findAll(@Param('newsId') newsId: number): Promise<CommentsEntity[]> {
    return this.commentsService.findAll(newsId);

  }

  @Get('/:newsId/:commentId')
  @ApiTags('comments')
  @ApiResponse({
    status: 200,
    description: 'get comment by newsId and commentId',
    type: CommentsEntity,
  })
  async findOne(@Param('commentId') commentId: number): Promise<CommentsEntity> {
    return await this.commentsService.findOne(commentId);
  }

  @Patch('/:commentId')
  @ApiTags('comments')
  @ApiBody({type: UpdateCommentDto})
  @ApiResponse({
    status: 200,
    description: 'update comment',
    type: CommentsEntity
  })
  async update(@Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<CommentsEntity> {
    return await this.commentsService.update(commentId, updateCommentDto.message);
  }

  @Delete('/:commentId')
  @ApiTags('comments')
  @ApiResponse({
    status: 200,
    description: 'delete comment',
    type: CommentsEntity
  })
  async remove(@Param('commentId') commentId: number): Promise<number> {
    return await this.commentsService.remove(commentId);
  }
}

