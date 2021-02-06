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
import { Comment } from './schema/comment.schema';
import { CheckChanalPipe } from '../../common/pipes/checkChanal.pipe';
import { AllowedFieldsToBeUpdatedPipe } from '../../common/pipes/allowedFieldsToBeUpdated.pipe';
import { MongooseValidationErrorExceptionFilter } from '../../common/filters/mongooseValidationErrorException.filter';
import { ValidateCommentPipe } from './pipes/validateComment.pipe';
import { GetCommentsPipe } from './pipes/getComments.pipe';

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
    @Body(CheckChanalPipe, new AllowedFieldsToBeUpdatedPipe(['content']))
    fields: Partial<Comment>,
  ) {
    return this.commentService.editComment(commentId, fields);
  }

  @Delete('/comment/:commentId')
  deletePost(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
