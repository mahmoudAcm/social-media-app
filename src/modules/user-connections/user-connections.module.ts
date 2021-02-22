import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConnectionsService } from './user-connections.service';
import { Follower, Friend, FollowerSchema, FriendSchema } from './schema';
import { UserConnectionsController } from './user-connections.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
  ],
  providers: [UserConnectionsService],
  controllers: [UserConnectionsController],
})
export class UserConnectionsModule {}
