import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interest, InterestDocument } from './schemas/interest.schema';
import { CreateInterestDto } from './dto/create-interest.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel(Interest.name) private interestModel: Model<InterestDocument>,
  ) {}

  async createInterest(createInterestDto: CreateInterestDto) {
    const existingInterest = await this.interestModel.findOne({ name: createInterestDto.name });
    if (existingInterest) {
      throw new BadRequestException('Interest already exists');
    }
    const newInterest = new this.interestModel(createInterestDto);
    return newInterest.save();
  }

  async getAllInterests() {
    return this.interestModel.find().exec();
  }
}
