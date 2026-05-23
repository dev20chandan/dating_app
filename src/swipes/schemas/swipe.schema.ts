import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SwipeDocument = Swipe & Document;

export enum SwipeType {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  SUPER_LIKE = 'SUPER_LIKE',
}

@Schema({ timestamps: true })
export class Swipe {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sourceUser: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  targetUser: User;

  @Prop({ type: String, enum: SwipeType, required: true })
  type: SwipeType;
}

export const SwipeSchema = SchemaFactory.createForClass(Swipe);
SwipeSchema.index({ sourceUser: 1, targetUser: 1 }, { unique: true });
