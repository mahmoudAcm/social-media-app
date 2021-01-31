import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { SocialPost } from '../post/schema/post.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<Comment & Document>,
    @InjectModel(SocialPost.name)
    private readonly PostModel: Model<SocialPost & Document>,
  ) {}

  private readonly per_page = 10;

  async createComment(commentData: Comment) {
    //searching for the post exsistance to take chanal value from it.
    const post = await this.PostModel.findById(commentData.post);
    if (!post) {
      throw new NotFoundException(
        null,
        `the post with id \`${commentData.post}\` was not found`,
      );
    }

    const comment = new this.CommentModel({
      ...commentData,
      chanal: post.chanal,
    });
    await comment.save();

    comment.owner = '/profile/' + comment.owner;
    comment.post = '/post/' + comment.post;
    return comment;
  }

  async getComments(postId: string, page: number) {
    const post = await this.PostModel.findById(postId);
    if (!post) {
      throw new NotFoundException(
        null,
        `the post with id \`${postId}\` was not found`,
      );
    }

    const comments = await this.CommentModel.find({ post: postId });
    const total_pages = Math.ceil(comments.length / this.per_page);
    if (page > total_pages) {
      throw new NotFoundException(null, `page ${page} is not found`);
    }

    const start = this.per_page * (page - 1);
    const end = start + this.per_page;

    return {
      comments: comments
        .slice(start, end)
        .map((comment: Comment & Document) => {
          return {
            ...comment.toJSON(),
            owner: '/profile/' + comment.owner,
            post: '/post/' + comment.post,
          };
        }),
      page,
      per_page: this.per_page,
      total_pages,
      total: comments.length,
    };
  }

  async editComment(commentId: string, fields: Partial<Comment>) {
    const comment = await this.CommentModel.findByIdAndUpdate(
      commentId,
      fields,
      {
        new: true,
      },
    );
    if (!comment) {
      throw new NotFoundException(
        null,
        `the comment with id \`${commentId}\` was not found`,
      );
    }

    comment.owner = '/profile/' + comment.owner;
    comment.post = '/post/' + comment.post;

    return comment;
  }

  async deleteComment(commentId: string) {
    const comment = await this.CommentModel.findByIdAndDelete(commentId);
    if (!comment) {
      throw new NotFoundException(
        null,
        `the comment with id \`${commentId}\` was not found`,
      );
    }

    return {
      message: 'deleted successfuly',
    };
  }
}
