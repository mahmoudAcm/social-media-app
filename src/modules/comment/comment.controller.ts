import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './schema';
import {
  CheckChanalPipe,
  AllowedFieldsToBeUpdatedPipe,
} from '../../common/pipes';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters';
import { ValidateCommentPipe, GetCommentsPipe } from './pipes';

@Controller()
@UseFilters(MongooseValidationErrorExceptionFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/comment')
  @UsePipes(CheckChanalPipe, ValidateCommentPipe)
  createComment(@Body() commentData: Comment) {
    return this.commentService.createComment(commentData);
  }

  @Get('/comments')
  @UsePipes(GetCommentsPipe)
  getPosts(@Query() query: any) {
    const { post, page } = query;
    return this.commentService.getComments(post, page);
  }

  @Put('/comment/:commentId')
  editComment(
    @Param('commentId') commentId: string,
    @Body(AllowedFieldsToBeUpdatedPipe.include(['content']))
    fields: Partial<Comment>,
  ) {
    return this.commentService.editComment(commentId, fields);
  }

  @Delete('/comment/:commentId')
  deletePost(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
