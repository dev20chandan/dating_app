import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type BlockedUserDocument = BlockedUser & Document;

@Schema({ timestamps: true })
export class BlockedUser {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  blocker: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  blocked: User;
}

export const BlockedUserSchema = SchemaFactory.createForClass(BlockedUser);
BlockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });
