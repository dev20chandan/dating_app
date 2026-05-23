import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatchRequest, MatchRequestDocument, MatchRequestStatus } from './schemas/match-request.schema';
// Match needs to be imported or we can just emit an event, but since this is direct backend, we might just update status

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(MatchRequest.name) private matchRequestModel: Model<MatchRequestDocument>,
  ) {}

  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send request to yourself');
    }

    const senderObjId = new Types.ObjectId(senderId);
    const receiverObjId = new Types.ObjectId(receiverId);

    const existingRequest = await this.matchRequestModel.findOne({
      sender: senderObjId as any,
      receiver: receiverObjId as any,
    });

    if (existingRequest) {
      throw new BadRequestException('Request already sent');
    }

    const newRequest = new this.matchRequestModel({
      sender: senderObjId as any,
      receiver: receiverObjId as any,
    });
    return newRequest.save();
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.matchRequestModel.findOne({
      _id: new Types.ObjectId(requestId),
      receiver: new Types.ObjectId(userId) as any,
      status: MatchRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Pending request not found');
    }

    request.status = MatchRequestStatus.ACCEPTED;
    await request.save();

    // Trigger match creation here if needed (depends on if requests are for matches or just DMs)
    return request;
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.matchRequestModel.findOne({
      _id: new Types.ObjectId(requestId),
      receiver: new Types.ObjectId(userId) as any,
      status: MatchRequestStatus.PENDING,
    });

    if (!request) {
      throw new NotFoundException('Pending request not found');
    }

    request.status = MatchRequestStatus.REJECTED;
    return request.save();
  }

  async getPendingRequests(userId: string) {
    return this.matchRequestModel.find({
      receiver: new Types.ObjectId(userId) as any,
      status: MatchRequestStatus.PENDING,
    }).populate('sender', 'name email').exec();
  }
}
