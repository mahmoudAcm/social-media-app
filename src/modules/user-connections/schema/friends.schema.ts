import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Friend {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop()
  confirmedAt: Date;

  @Prop({ default: Types.ObjectId })
  connection: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
