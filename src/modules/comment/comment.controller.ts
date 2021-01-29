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
import { CastErrorExceptionFilter } from '../../common/filters/castErrorException.filter';
import { ValidateCommentPipe } from './pipes/validateComment.pipe';
import { GetCommentsPipe } from './pipes/getComments.pipe';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/comment')
  @UsePipes(CheckChanalPipe, ValidateCommentPipe)
  @UseFilters(CastErrorExceptionFilter)
  createComment(@Body() commentData: Comment) {
    return this.commentService.createComment(commentData);
  }

  @Get('/comments')
  @UseFilters(CastErrorExceptionFilter)
  @UsePipes(GetCommentsPipe)
  getPosts(@Query() query: any) {
    const { post, page } = query;
    return this.commentService.getComments(post, page);
  }

  @Put('/comment/:commentId')
  @UseFilters(CastErrorExceptionFilter)
  editComment(
    @Param('commentId') commentId: string,
    @Body(CheckChanalPipe) fields: Partial<Comment>,
  ) {
    return this.commentService.editComment(commentId, fields);
  }

  @Delete('/comment/:commentId')
  @UseFilters(CastErrorExceptionFilter)
  deletePost(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
