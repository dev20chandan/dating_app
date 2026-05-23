import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userA: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userB: User;

  @Prop({ default: Date.now })
  matchedAt: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });
