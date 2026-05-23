import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MatchRequestDocument = MatchRequest & Document;

export enum MatchRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class MatchRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  receiver: User;

  @Prop({ type: String, enum: MatchRequestStatus, default: MatchRequestStatus.PENDING })
  status: MatchRequestStatus;
}

export const MatchRequestSchema = SchemaFactory.createForClass(MatchRequest);
MatchRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
