import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop({ unique: true, sparse: true })
  phoneNumber?: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  intent?: string; // 'dating', 'serious', 'marriage'

  @Prop()
  dob?: string;

  @Prop()
  identity?: string; // 'male', 'female', 'non-binary'

  @Prop([String])
  photos?: string[];

  @Prop()
  video?: string;

  @Prop([String])
  interests?: string[];

  @Prop()
  bio?: string;

  @Prop({ type: [Number], default: [18, 99] })
  matchAgeRange?: number[];

  @Prop({ default: 50 })
  matchDistance?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
