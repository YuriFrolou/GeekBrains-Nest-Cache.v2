import {forwardRef, Module} from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import {UsersModule} from "../users/users.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {NewsEntity} from "../../entities/news.entity";
import {CommentsEntity} from "../../entities/comments.entity";
import {UsersEntity} from "../../entities/users.entity";


@Module({
  imports: [forwardRef(()=>UsersModule),CommentsModule,
    TypeOrmModule.forFeature([NewsEntity,CommentsEntity,UsersEntity])
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports:[NewsService]

})
export class NewsModule {}
