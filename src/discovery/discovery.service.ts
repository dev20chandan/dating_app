import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';
import { Swipe, SwipeDocument } from '../swipes/schemas/swipe.schema';
import { Match, MatchDocument } from '../matches/schemas/match.schema';
import { BlockedUser, BlockedUserDocument } from '../blocks/schemas/blocked-user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Swipe.name) private swipeModel: Model<SwipeDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(BlockedUser.name) private blockedUserModel: Model<BlockedUserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRecommendations(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Check Cache First
    const cacheKey = `discovery_${userId}_${page}_${limit}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const userObjectId = new Types.ObjectId(userId);
    const userProfile = await this.profileModel.findOne({ userId: userObjectId as any }).exec();
    if (!userProfile) {
      return [];
    }

    // Exclusions
    const [swipes, matches, blocks] = await Promise.all([
      this.swipeModel.find({ sourceUser: userObjectId as any }).select('targetUser').exec(),
      this.matchModel.find({ $or: [{ userA: userObjectId as any }, { userB: userObjectId as any }] }).exec(),
      this.blockedUserModel.find({ $or: [{ blocker: userObjectId as any }, { blocked: userObjectId as any }] }).exec(),
    ]);

    const swipedUserIds = swipes.map(s => s.targetUser);
    const matchedUserIds = matches.map(m => (m.userA as any).toString() === userObjectId.toString() ? m.userB : m.userA);
    const blockedUserIds = blocks.map(b => (b.blocker as any).toString() === userObjectId.toString() ? b.blocked : b.blocker);

    const excludedUserIds = [
      userObjectId,
      ...swipedUserIds,
      ...matchedUserIds,
      ...blockedUserIds,
    ];

    // Pipeline
    const pipeline: any[] = [];

    // GeoNear MUST be the first stage if location exists
    if (userProfile.location && userProfile.location.coordinates.length === 2 && userProfile.location.coordinates[0] !== 0) {
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: userProfile.location.coordinates,
          },
          distanceField: 'distance',
          spherical: true,
        },
      });
    }

    // Match filter
    const matchStage: any = {
      userId: { $nin: excludedUserIds },
    };

    if (userProfile.interestedIn !== 'EVERYONE') {
      matchStage.gender = userProfile.interestedIn;
    }

    pipeline.push({ $match: matchStage });

    // Lookup Interests
    pipeline.push({
      $lookup: {
        from: 'interests',
        localField: 'interests',
        foreignField: '_id',
        as: 'populatedInterests',
      },
    });

    // Compatibility Calculation Projection
    pipeline.push({
      $addFields: {
        sharedInterestsCount: {
          $size: {
            $setIntersection: ['$interests', userProfile.interests || []],
          },
        },
        maxInterests: {
          $max: [
            { $size: { $ifNull: ['$interests', []] } },
            { $size: { $ifNull: [userProfile.interests, []] } },
            1 // prevent division by zero
          ]
        }
      }
    });

    pipeline.push({
      $addFields: {
        interestScore: {
          $multiply: [{ $divide: ['$sharedInterestsCount', '$maxInterests'] }, 40]
        },
        ageScore: {
          $cond: {
            if: { $lte: [{ $abs: { $subtract: ['$age', userProfile.age] } }, 5] },
            then: 20,
            else: {
              $max: [0, { $subtract: [20, { $multiply: [{ $abs: { $subtract: ['$age', userProfile.age] } }, 2] }] }]
            }
          }
        },
        distanceScore: {
          $cond: {
            if: { $ifNull: ['$distance', false] },
            then: {
              $max: [0, { $subtract: [15, { $divide: ['$distance', 1000] }] }] // 1 point deduction per km
            },
            else: 15 // If no distance, give max score
          }
        },
        genderScore: {
          $cond: {
            if: { $eq: ['$gender', userProfile.interestedIn] },
            then: 15,
            else: { $cond: [{ $eq: [userProfile.interestedIn, 'EVERYONE'] }, 15, 0] }
          }
        },
        bioScore: {
          $cond: {
            if: { $and: [{ $gt: [{ $strLenCP: { $ifNull: ['$bio', ''] } }, 20] }, { $gt: [{ $strLenCP: { $ifNull: [userProfile.bio, ''] } }, 20] }] },
            then: 10,
            else: 0
          }
        }
      }
    });

    pipeline.push({
      $addFields: {
        compatibilityScore: {
          $add: ['$interestScore', '$ageScore', '$distanceScore', '$genderScore', '$bioScore']
        }
      }
    });

    // Filter by >= 70 score
    pipeline.push({
      $match: {
        compatibilityScore: { $gte: 70 }
      }
    });

    // Sort by compatibility descending
    pipeline.push({ $sort: { compatibilityScore: -1 } });

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const results = await this.profileModel.aggregate(pipeline).exec();

    // Cache the results for 60 seconds
    await this.cacheManager.set(cacheKey, results, 60000);

    return results;
  }
}
