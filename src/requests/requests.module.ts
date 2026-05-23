import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { MatchRequest, MatchRequestSchema } from './schemas/match-request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MatchRequest.name, schema: MatchRequestSchema }])],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
