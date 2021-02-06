import { Controller, Post, Get, Body, Param, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters/mongooseValidationErrorException.filter';

@Controller()
@UseFilters(MongooseValidationErrorExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user')
  createUser(@Body() userData: User) {
    return this.userService.createUser(userData);
  }

  @Get('/profile/:username')
  getProfile(@Param('username') username: string) {
    return this.userService.getUser(username);
  }
}
