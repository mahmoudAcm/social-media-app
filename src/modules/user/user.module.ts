import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema, Profile, ProfileSchema } from './schema';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { UserConnectionsModule } from '../user-connections/user-connections.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    PostModule,
    CommentModule,
    UserConnectionsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
