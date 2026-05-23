import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    const existingProfile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) as any });
    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }
    const newProfile = new this.profileModel({
      ...createProfileDto,
      userId: new Types.ObjectId(userId) as any,
    });
    return newProfile.save();
  }

  async getProfile(userId: string) {
    const profile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) as any }).populate('interests').exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) as any },
      updateProfileDto,
      { new: true }
    ).populate('interests').exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
