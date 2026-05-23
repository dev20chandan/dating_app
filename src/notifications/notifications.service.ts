import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(userId: string, type: NotificationType, content: string) {
    const newNotification = new this.notificationModel({
      userId: new Types.ObjectId(userId) as any,
      type,
      content,
    });
    return newNotification.save();
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) as any }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true }).exec();
  }
}
