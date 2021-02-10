import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Query,
  Get,
  UsePipes,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SocialPost } from './schema';
import {
  CheckChanalPipe,
  AllowedFieldsToBeUpdatedPipe,
} from '../../common/pipes';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters';
import {
  GetPostsPipe,
  CheckReactionTypePipe,
  GetReactionsPipe,
  ReactWithPipe,
} from './pipes';

@Controller()
@UseFilters(MongooseValidationErrorExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/post')
  @UsePipes(CheckChanalPipe)
  createPost(@Body() postData: SocialPost) {
    return this.postService.createPost(postData);
  }

  @Get('/posts')
  @UsePipes(GetPostsPipe)
  getPosts(@Query() query: any) {
    const { user, page, filter } = query;
    return this.postService.getPosts(user, page, filter);
  }

  @Get('/post/:postId')
  getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }

  @Put('/post/:postId')
  editPost(
    @Param('postId') postId: string,
    @Body(
      CheckChanalPipe,
      new AllowedFieldsToBeUpdatedPipe(['content', 'type', 'title']),
    )
    fields: Partial<SocialPost>,
  ) {
    return this.postService.editPost(postId, fields);
  }

  @Delete('/post/:postId')
  deletePost(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }

  @Post('/reactWith/:reaction')
  reactWith(
    @Body(ReactWithPipe) react: any,
    @Param('reaction', CheckReactionTypePipe) reaction: string,
  ) {
    return this.postService.reactWith(react, reaction);
  }

  @Get('/reactions')
  @UsePipes(GetReactionsPipe)
  getReactions(@Query() query: any) {
    return this.postService.getReactions(query);
  }
}
