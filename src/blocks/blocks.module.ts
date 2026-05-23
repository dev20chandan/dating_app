import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { BlockedUser, BlockedUserSchema } from './schemas/blocked-user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlockedUser.name, schema: BlockedUserSchema }])],
  controllers: [BlocksController],
  providers: [BlocksService]
})
export class BlocksModule {}
