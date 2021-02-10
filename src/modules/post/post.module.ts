import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialPost, PostSchema } from './schema';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Activity, ActivitySchema } from '../user/schema';
import { Comment, CommentSchema } from '../comment/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialPost.name, schema: PostSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
