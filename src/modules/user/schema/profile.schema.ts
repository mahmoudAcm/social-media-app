import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  owner: string;

  @Prop()
  comments: number;

  @Prop()
  shares: number;

  @Prop()
  interactions: number;

  @Prop()
  posts: number;

  @Prop()
  followers: number;

  @Prop()
  friends: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
