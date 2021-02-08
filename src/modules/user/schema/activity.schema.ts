import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  owner: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  activity: string;

  @Prop({
    enum: ['share', 'comment', 'love', 'hate', 'like', 'sad', 'laugh'],
    required: true,
  })
  type: string;

  @Prop({ required: true, enum: ['post', 'comment'] })
  belongsTo: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
