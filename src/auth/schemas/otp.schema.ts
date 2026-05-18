import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  identifier: string; // email or phone number

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, default: Date.now, expires: 300 }) // Expires after 5 minutes (300 seconds)
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
