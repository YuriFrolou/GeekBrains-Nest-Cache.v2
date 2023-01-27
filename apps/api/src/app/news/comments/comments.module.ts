import { Module,forwardRef } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import {NewsModule} from "../news.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentsEntity} from "../../../entities/comments.entity";
import {UsersModule} from "../../users/users.module";

@Module({
  imports: [forwardRef(() => NewsModule),forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([CommentsEntity])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports:[CommentsService]
})
export class CommentsModule {}
