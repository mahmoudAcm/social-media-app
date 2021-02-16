import { Module } from '@nestjs/common';
import { SocialGateway } from './social.gateway';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [PostModule, CommentModule],
  providers: [SocialGateway],
})
export class EventsModule {}
