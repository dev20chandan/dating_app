import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { Profile, ProfileSchema } from '../profiles/schemas/profile.schema';
import { Swipe, SwipeSchema } from '../swipes/schemas/swipe.schema';
import { Match, MatchSchema } from '../matches/schemas/match.schema';
import { BlockedUser, BlockedUserSchema } from '../blocks/schemas/blocked-user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Profile.name, schema: ProfileSchema },
    { name: Swipe.name, schema: SwipeSchema },
    { name: Match.name, schema: MatchSchema },
    { name: BlockedUser.name, schema: BlockedUserSchema }
  ])],
  controllers: [DiscoveryController],
  providers: [DiscoveryService]
})
export class DiscoveryModule {}
