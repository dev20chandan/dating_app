import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Swipe, SwipeDocument, SwipeType } from './schemas/swipe.schema';
import { Match, MatchDocument } from '../matches/schemas/match.schema';
import { Notification, NotificationDocument, NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class SwipesService {
  constructor(
    @InjectModel(Swipe.name) private swipeModel: Model<SwipeDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    // @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>, // wait, notification model is not imported here, I'll use it or inject it later. I will inject NotificationService if possible or just models
  ) {}

  async createSwipe(sourceUserId: string, targetUserId: string, type: SwipeType) {
    if (sourceUserId === targetUserId) {
      throw new BadRequestException('Cannot swipe yourself');
    }

    const sourceObjId = new Types.ObjectId(sourceUserId);
    const targetObjId = new Types.ObjectId(targetUserId);

    const existingSwipe = await this.swipeModel.findOne({
      sourceUser: sourceObjId as any,
      targetUser: targetObjId as any,
    });

    if (existingSwipe) {
      throw new BadRequestException('Already swiped this user');
    }

    const newSwipe = new this.swipeModel({
      sourceUser: sourceObjId as any,
      targetUser: targetObjId as any,
      type,
    });
    await newSwipe.save();

    let isMatch = false;

    // Check for mutual swipe if right or super like
    if (type === SwipeType.RIGHT || type === SwipeType.SUPER_LIKE) {
      const mutualSwipe = await this.swipeModel.findOne({
        sourceUser: targetObjId as any,
        targetUser: sourceObjId as any,
        type: { $in: [SwipeType.RIGHT, SwipeType.SUPER_LIKE] },
      });

      if (mutualSwipe) {
        // Create match
        const match = new this.matchModel({
          userA: sourceObjId as any,
          userB: targetObjId as any,
        });
        await match.save();
        isMatch = true;

        // Note: we can trigger notifications here using event emitter or direct injection
      }
    }

    return { success: true, isMatch, swipe: newSwipe };
  }
}
