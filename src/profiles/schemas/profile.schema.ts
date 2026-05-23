import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Interest } from '../../interests/schemas/interest.schema';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: User;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  bio: string;

  @Prop({ required: true, enum: ['MALE', 'FEMALE', 'NON_BINARY'] })
  gender: string;

  @Prop({ required: true, enum: ['MALE', 'FEMALE', 'NON_BINARY', 'EVERYONE'] })
  interestedIn: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  dob: Date;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop([String])
  photos: string[];

  @Prop()
  occupation: string;

  @Prop()
  education: string;

  @Prop({ enum: ['LONG_TERM', 'SHORT_TERM', 'NEW_FRIENDS', 'NOT_SURE'] })
  relationshipGoal: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Interest' }] })
  interests: Interest[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ location: '2dsphere' });
