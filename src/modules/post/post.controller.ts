import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Get,
  UseFilters,
  UsePipes,
  NotImplementedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SocialPost } from './schema/post.schema';
import { CheckChanalPipe } from './pipes/checkChanal.pipe';
import { CreatePostExceptionFilter } from './filters/createPostException.filter';
import { GetPostsPipe } from './pipes/getPosts.pipe';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/post')
  @UsePipes(CheckChanalPipe)
  @UseFilters(CreatePostExceptionFilter)
  createPost(@Body() postData: SocialPost) {
    return this.postService.createPost(postData);
  }

  @Get('/posts')
  @UsePipes(GetPostsPipe)
  getPosts(@Query() query: any) {
    const { user, page, ...optional } = query;
    return this.postService.getPosts(user, page, optional);
  }

  @Get('/post/:postId')
  async getPost(@Param('postId') postId: string) {
    throw new NotImplementedException(null, 'Not Implemented');
  }
}
