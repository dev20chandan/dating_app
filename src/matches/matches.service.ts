import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  async getMatches(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    return this.matchModel.find({
      $or: [{ userA: userObjId as any }, { userB: userObjId as any }]
    }).populate('userA', 'name email').populate('userB', 'name email').exec();
  }
}
