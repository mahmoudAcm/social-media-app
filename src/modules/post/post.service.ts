import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { SocialPost } from './schema';
import { Activity } from '../user/schema';
import { Comment } from '../comment/schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(SocialPost.name)
    private readonly PostModel: Model<SocialPost & Document>,
    @InjectModel(Activity.name)
    private readonly ActivityModel: Model<Activity & Document>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<Comment & Document>,
  ) {}

  private readonly per_page = 20;

  async createPost(postData: SocialPost) {
    const post = new this.PostModel(postData);
    await post.save();

    post.owner = '/profile/' + post.owner;
    return {
      ...post.toJSON(),
      reactions: {
        link: `/reactions?activity=${post.id}&page={pageNumber}`,
        per_page: 10,
      },
    };
  }

  async getPosts(user: string, page: number, filter?: any) {
    const posts = (await this.PostModel.find({ owner: user })).filter(
      function checkDate({ createdAt }: any) {
        if (Object.keys(filter || {}).length === 0) return true;

        const timestamps = Math.round(new Date(createdAt).getTime() / 1000.0);
        if (filter.name === 'postedBetween') {
          return timestamps >= filter.start && timestamps <= filter.end;
        }

        return filter.name === 'postedAfter'
          ? timestamps >= filter[filter.name]
          : timestamps <= filter[filter.name];
      },
    );

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
        reactions: {
          link: `/reactions?activity=${post.id}&page={pageNumber}`,
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
      reactions: {
        link: `/reactions?activity=${post.id}&page={pageNumber}`,
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
      reactions: {
        link: `/reactions?activity=${post.id}&page={pageNumber}`,
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

  async reactWith(react: any, reaction: string) {
    const types = ['love', 'hate', 'like', 'sad', 'laugh'];
    for (const type of types) {
      const activity = await this.ActivityModel.findOne({ ...react, type });
      if (activity) {
        if (type === reaction) {
          //delete it
          await this.ActivityModel.findOneAndDelete({ ...react, type });
          return { message: 'deleted' };
        } else {
          //update it
          activity.type = reaction;
          await activity.save();

          activity.activity = '/' + react.belongsTo + '/' + activity.activity;
          activity.owner = '/profile/' + activity.owner;
          return activity;
        }
      }
    }

    //create it
    const activity = new this.ActivityModel({ ...react, type: reaction });
    await activity.save();

    activity.activity = '/' + react.belongsTo + '/' + activity.activity;
    activity.owner = '/profile/' + activity.owner;
    return activity;
  }

  async getReactions({ activity, page }: any) {
    let belongsTo = '';
    if (await this.PostModel.findById(activity)) {
      belongsTo = 'post';
    }

    if (await this.CommentModel.findById(activity)) {
      belongsTo = 'comment';
    }

    if (!belongsTo) {
      throw new NotFoundException(
        null,
        `the activity with value \`${activity}\` was not found`,
      );
    }

    const types = ['love', 'hate', 'like', 'sad', 'laugh'];
    const activities = (await this.ActivityModel.find({ activity })).filter(
      function checkType({ type }) {
        return types.includes(type);
      },
    );

    const total_pages = Math.ceil(activities.length / this.per_page);
    if (page > total_pages) {
      throw new NotFoundException(null, `page ${page} is not found`);
    }

    const start = 10 * (page - 1);
    const end = start + 10;

    return {
      reactions: activities
        .slice(start, end)
        .map(({ owner, activity, ...rest }) => {
          return {
            ...(rest as any)._doc,
            owner: '/profile/' + owner,
            activity: '/' + belongsTo + '/' + activity,
          };
        }),
      page,
      per_page: 10,
      total_pages,
      total: activities.length,
    };
  }

  async sharePost(postId: string, postData: SocialPost) {
    const post = new this.PostModel({
      ...postData,
      sharedFrom: postId,
    });
    await post.save();

    post.owner = '/profile/' + post.owner;
    post.sharedFrom = '/post/' + postId;

    const activity = new this.ActivityModel({
      owner: post.owner,
      type: 'share',
      activity: postId,
      belongsTo: 'post',
    });
    await activity.save();

    return post;
  }

  async count(userId: string, type: 'shares' | 'interactions') {
    let types: Array<string>;
    if (type == 'shares') {
      types = ['share'];
    } else if (type == 'interactions') {
      types = ['love', 'hate', 'like', 'sad', 'laugh'];
    }

    const activities = (
      await this.ActivityModel.find({ owner: userId })
    ).filter(function checkType({ type }) {
      return types.includes(type);
    });
    return activities.length;
  }
}
