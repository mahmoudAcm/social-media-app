import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { UserConnectionsService } from './user-connections.service';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters';
import { GetConnectionsPipe } from './pipes';

@Controller()
@UseFilters(MongooseValidationErrorExceptionFilter)
export class UserConnectionsController {
  constructor(
    private readonly userConnectionsService: UserConnectionsService,
  ) {}

  @Post('/connect-with/:username')
  connectWith(
    @Body('sender') sender: string,
    @Param('username') receiver: string,
  ) {
    return this.userConnectionsService.connectWith(sender, receiver);
  }

  @Post('/follow/:username')
  follow(
    @Body('follower') follower: string,
    @Param('username') following: string,
  ) {
    return this.userConnectionsService.follow(follower, following);
  }

  @Get('/followers')
  @UsePipes(GetConnectionsPipe)
  getFollowers(@Query() query: any) {
    const { user, page } = query;
    return this.userConnectionsService.getFollowers(user, page);
  }

  @Get('/friend-requests')
  @UsePipes(GetConnectionsPipe)
  getFriendRequests(@Query() query: any) {
    const { user, page } = query;
    return this.userConnectionsService.getUsers(user, page, false);
  }

  @Get('/friends')
  @UsePipes(GetConnectionsPipe)
  getFriends(@Query() query: any) {
    const { user, page } = query;
    return this.userConnectionsService.getUsers(user, page, true);
  }

  @Post('/accept-request')
  acceptRequest(
    @Body('sender') sender: string,
    @Body('receiver') receiver: string,
  ) {
    return this.userConnectionsService.acceptRequest(sender, receiver);
  }
}
