import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterestDocument = Interest & Document;

@Schema({ timestamps: true })
export class Interest {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  icon: string;

  @Prop()
  category: string;
}

export const InterestSchema = SchemaFactory.createForClass(Interest);
