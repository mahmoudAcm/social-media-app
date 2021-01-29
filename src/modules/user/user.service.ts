import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from './schema/user.schema';
import { Profile } from './schema/profile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User & Document>,
    @InjectModel(Profile.name)
    private readonly ProfileModel: Model<Profile & Document>,
  ) {}

  /**
   * @description removes unwanted data
   * @param skippedKeys the keys that we want to skip
   * @param data the data wich will be filterd
   */
  removeSensitiveData(skippedKeys: any, data: any) {
    return (prevData: any, key: string) => {
      return !skippedKeys[key] ? { ...prevData, [key]: data[key] } : prevData;
    };
  }

  async createUser(userData: User) {
    const newUser = new this.UserModel(userData);
    await newUser.save();
    const skippedKeys = { password: true };
    const newUserJSON: User = newUser.toJSON();
    const wantedKeys = Object.keys(newUserJSON);
    return wantedKeys.reduce(
      this.removeSensitiveData(skippedKeys, newUserJSON),
      { profile: '/profile/' + newUserJSON.username },
    );
  }

  async getUser(username: string) {
    const user = await this.UserModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(user, 'user is not found');
    }
    const skippedKeys = { password: true };
    const userJSON: User = user.toJSON();
    const wantedKeys = Object.keys(userJSON);
    return wantedKeys.reduce(this.removeSensitiveData(skippedKeys, userJSON), {
      comments: 10,
      shares: 10,
      interactions: 10,
      posts: {
        link: `/posts?user=${username}&page={pageNumber}`,
        total_pages: 10,
        per_page: 20,
        total: 10,
        filters: [
          `/posts?user=${username}&page={pageNumber}&postedAfter={publishDate}`,
          `/posts?user=${username}&page={pageNumber}&postedBefor={publishDate}`,
          `/posts?user=${username}&page={pageNumber}&postedBetween={startDate,endDate}`,
        ],
      },
      followers: {
        link: `/followers?user=${username}&page={pageNumber}`,
        total_pages: 10,
        per_page: 20,
        total: 10,
      },
      firends: {
        link: `/friends?user=${username}&page={pageNumber}`,
        total_pages: 10,
        per_page: 20,
        total: 10,
      },
    });
  }
}