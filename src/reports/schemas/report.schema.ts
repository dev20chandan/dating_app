import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ReportDocument = Report & Document;

export enum ReportReason {
  SPAM = 'SPAM',
  FAKE = 'FAKE',
  ABUSE = 'ABUSE',
  INAPPROPRIATE = 'INAPPROPRIATE',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  reporter: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  reported: User;

  @Prop({ type: String, enum: ReportReason, required: true })
  reason: ReportReason;

  @Prop()
  details: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
