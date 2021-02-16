import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './schema';
import { AllowedFieldsToBeUpdatedPipe } from '../../common/pipes';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters';
import { GetCommentsPipe } from './pipes';

@Controller()
@UseFilters(MongooseValidationErrorExceptionFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
