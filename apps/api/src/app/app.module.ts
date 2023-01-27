import {
  CacheInterceptor,
  CacheModule,
  Module,
} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {NewsModule} from './news/news.module';
import {UsersModule} from './users/users.module';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersEntity} from '../entities/users.entity';
import {NewsEntity} from '../entities/news.entity';
import {CommentsEntity} from '../entities/comments.entity';
import {CommentsModule} from './news/comments/comments.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {APP_INTERCEPTOR} from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';
import Redis from "ioredis";

export const redis = new Redis();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    NewsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.TYPEORM_HOST || 'localhost',
      host: 'localhost',
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      port: +process.env.TYPEORM_PORT,
      logging: true,
      migrationsRun: true,
      synchronize: true,
      entities: [UsersEntity, NewsEntity, CommentsEntity],
    }),
    CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CacheModule.registerAsync(
      {
        isGlobal: true,
        useFactory: async() => {
          return {
            store: redisStore,
            // host: process.env.REDIS_HOST || 'localhost',
            host: 'localhost',
            port: process.env.REDIS_PORT || 6379,
            expire: 60 * 60,
            ttl: 60,
            max: 1000,
          }
        },
      }
    ),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class AppModule {
}
