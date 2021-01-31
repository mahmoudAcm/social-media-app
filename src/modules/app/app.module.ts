import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_LINK } from '../../configs';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_LINK, { useFindAndModify: false }),
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
