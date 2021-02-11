import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class SocialPost {
  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Types.ObjectId, type: Types.ObjectId })
  chanal: string;

  @Prop({ default: 'nothing', type: Types.ObjectId })
  sharedFrom: string;

  @Prop()
  title?: string;
}

export const PostSchema = SchemaFactory.createForClass(SocialPost);
