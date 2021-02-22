import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Follower, Friend } from './schema';

@Injectable()
export class UserConnectionsService {
  constructor(
    @InjectModel(Follower.name)
    private readonly FollowerModel: Model<Follower & Document>,
    @InjectModel(Friend.name)
    private readonly FriendModel: Model<Friend & Document>,
  ) {}

  private readonly per_page = 10;

  /**
   * @description checks if two users are connected
   */
  async exists(userA: string, userB: string, type?: 'follow') {
    if (type === 'follow') {
      return !!(await this.FollowerModel.findOne({
        follower: userA,
        following: userB,
      }));
    }

    return !!(await this.FriendModel.findOne({
      $or: [
        { sender: userA, receiver: userB },
        { sender: userB, receiver: userA },
      ],
    }));
  }

  async connectWith(sender: string, receiver: string) {
    if (await this.exists(sender, receiver)) {
      throw new BadRequestException(null, "can't make the same request twice");
    }
    const request = new this.FriendModel({ sender, receiver });
    await request.save();
  }

  async follow(follower: string, following: string) {
    if (await this.exists(follower, following, 'follow')) {
      throw new BadRequestException(null, "can't make the same request twice");
    }
    const request = new this.FollowerModel({ follower, following });
    await request.save();
  }

  async getFollowers(user: string, page: number) {
    const followers = await this.FollowerModel.find({ following: user });

    const total_pages = Math.ceil(followers.length / this.per_page);
    if (page > total_pages) {
      throw new NotFoundException(null, `page ${page} is not found`);
    }

    const start = this.per_page * (page - 1);
    const end = start + this.per_page;

    return {
      followers: followers.slice(start, end).map((row: Follower & Document) => {
        return {
          ...row.toJSON(),
          follower: '/profile/' + row.follower,
          following: '/profile/' + user,
        };
      }),
      page,
      per_page: this.per_page,
      total_pages,
      total: followers.length,
    };
  }

  async getUsers(user: string, page: number, confirmed: boolean) {
    const friends = await this.FriendModel.find({
      $or: [{ receiver: user }, { sender: user }],
      confirmed,
    });

    const total_pages = Math.ceil(friends.length / this.per_page);
    if (page > total_pages) {
      throw new NotFoundException(null, `page ${page} is not found`);
    }

    const start = this.per_page * (page - 1);
    const end = start + this.per_page;

    return {
      friends: friends.slice(start, end).map((row: Friend & Document) => {
        return {
          ...row.toJSON(),
          sender: '/profile/' + row.sender,
          receiver: '/profile/' + row.receiver,
        };
      }),
      page,
      per_page: this.per_page,
      total_pages,
      total: friends.length,
    };
  }

  async acceptRequest(sender: string, receiver: string) {
    const request = await this.FriendModel.findOne({
      $or: [
        { sender: receiver, receiver: sender },
        { sender, receiver },
      ],
    });

    if (request.confirmed) return;

    request.confirmed = true;
    request.confirmedAt = new Date();

    await request.save();
  }
}
