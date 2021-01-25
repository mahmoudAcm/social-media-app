import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['male', 'female'] })
  gender?: string;

  @Prop()
  phone?: string;

  @Prop()
  location?: string;

  @Prop()
  city?: string;

  @Prop()
  dateOfBirth?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
