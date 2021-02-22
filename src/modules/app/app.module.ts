import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_LINK } from '../../configs';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { UserConnectionsModule } from '../user-connections/user-connections.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_LINK, { useFindAndModify: false }),
    UserModule,
    PostModule,
    CommentModule,
    UserConnectionsModule,
    EventsModule,
  ],
})
export class AppModule {}
