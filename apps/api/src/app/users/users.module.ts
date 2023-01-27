import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../../entities/users.entity";
import {NewsModule} from "../news/news.module";
import {NewsService} from "../news/news.service";

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity]),forwardRef(()=>NewsModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
