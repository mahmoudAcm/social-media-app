import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, required: true })
  post: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  chanal: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
