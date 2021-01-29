import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Query,
  Get,
  UseFilters,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SocialPost } from './schema/post.schema';
import { CheckChanalPipe } from './pipes/checkChanal.pipe';
import { CreatePostExceptionFilter } from './filters/createPostException.filter';
import { CastErrorExceptionFilter } from './filters/castErrorException.filter';
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
  @UseFilters(CastErrorExceptionFilter)
  getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }

  @Put('/post/:postId')
  @UseFilters(CastErrorExceptionFilter)
  editPost(
    @Param('postId') postId: string,
    @Body(CheckChanalPipe) fields: Partial<SocialPost>,
  ) {
    return this.postService.editPost(postId, fields);
  }

  @Delete('/post/:postId')
  @UseFilters(CastErrorExceptionFilter)
  deletePost(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
