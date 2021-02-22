import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Follower {
  @Prop({ required: true })
  follower: string;

  @Prop({ required: true })
  following: string;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
