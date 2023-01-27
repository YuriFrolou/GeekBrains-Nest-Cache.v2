import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { CommentsEntity } from './comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('news')
  export class NewsEntity {

  @ApiProperty({
    example:1,
    description:'Идентификатор новости'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:'Новая новость',
    description:'Заголовок новости'
  })
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  cover: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];
}
