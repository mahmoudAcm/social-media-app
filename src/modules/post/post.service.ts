import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { SocialPost } from './schema/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(SocialPost.name)
    private readonly PostModel: Model<SocialPost & Document>,
  ) {}

  private readonly per_page = 20;

  async createPost(postData: SocialPost) {
    const post = new this.PostModel(postData);
    await post.save();

    post.owner = '/profile/' + post.owner;
    return post;
  }

  async getPosts(user: string, page: number, optional?: any) {
    const posts = await this.PostModel.find({ owner: user });

    const total_pages = Math.ceil(posts.length / this.per_page);
    if (page > total_pages) {
      throw new NotFoundException(null, `page ${page} is not found`);
    }

    const start = this.per_page * (page - 1);
    const end = start + this.per_page;

    return {
      posts: posts.slice(start, end).map((post: SocialPost & Document) => ({
        ...post.toJSON(),
        owner: '/profile/' + user,
        comments: {
          link: `/comments?post=${post.id}&page={pageNumber}`,
          per_page: 10,
        },
      })),
      page,
      per_page: this.per_page,
      total_pages,
      total: posts.length,
    };
  }

  async getPost(postId: string) {
    const post = await this.PostModel.findById(postId);
    if (!post) {
      throw new NotFoundException(
        null,
        `the post with id \`${postId}\` was not found`,
      );
    }

    post.owner = '/profile/' + post.owner;
    return {
      ...post.toJSON(),
      comments: {
        link: `/comments?post=${post.id}&page={pageNumber}`,
        per_page: 10,
      },
    };
  }

  async editPost(postId: string, fields: Partial<SocialPost>) {
    const post = await this.PostModel.findByIdAndUpdate(postId, fields, {
      new: true,
    });

    if (!post) {
      throw new NotFoundException(
        null,
        `the post with id \`${postId}\` was not found`,
      );
    }

    post.owner = '/profile/' + post.owner;

    return {
      ...post.toJSON(),
      comments: {
        link: `/comments?post=${postId}&page={pageNumber}`,
        per_page: 10,
      },
    };
  }

  async deletePost(postId: string) {
    const post = await this.PostModel.findByIdAndDelete(postId);
    if (!post) {
      throw new NotFoundException(
        null,
        `the post with id \`${postId}\` was not found`,
      );
    }

    return {
      message: 'deleted successfuly',
    };
  }
}
