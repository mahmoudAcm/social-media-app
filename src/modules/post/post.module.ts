import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialPost, PostSchema } from './schema/post.schema';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialPost.name, schema: PostSchema }]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
