import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlockedUser, BlockedUserDocument } from './schemas/blocked-user.schema';

@Injectable()
export class BlocksService {
  constructor(
    @InjectModel(BlockedUser.name) private blockedUserModel: Model<BlockedUserDocument>,
  ) {}

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new BadRequestException('Cannot block yourself');
    }

    const blockerObjId = new Types.ObjectId(blockerId);
    const blockedObjId = new Types.ObjectId(blockedId);

    const existingBlock = await this.blockedUserModel.findOne({
      blocker: blockerObjId as any,
      blocked: blockedObjId as any,
    });

    if (existingBlock) {
      throw new BadRequestException('User already blocked');
    }

    const newBlock = new this.blockedUserModel({
      blocker: blockerObjId as any,
      blocked: blockedObjId as any,
    });
    return newBlock.save();
  }

  async getBlockedUsers(userId: string) {
    return this.blockedUserModel.find({ blocker: new Types.ObjectId(userId) as any }).populate('blocked', 'name email').exec();
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return this.blockedUserModel.findOneAndDelete({
      blocker: new Types.ObjectId(blockerId) as any,
      blocked: new Types.ObjectId(blockedId) as any,
    }).exec();
  }
}
