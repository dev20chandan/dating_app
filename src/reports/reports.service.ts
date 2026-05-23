import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument, ReportReason } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async createReport(reporterId: string, reportedId: string, reason: ReportReason, details?: string) {
    if (reporterId === reportedId) {
      throw new BadRequestException('Cannot report yourself');
    }

    const reporterObjId = new Types.ObjectId(reporterId);
    const reportedObjId = new Types.ObjectId(reportedId);

    const existingReport = await this.reportModel.findOne({
      reporter: reporterObjId as any,
      reported: reportedObjId as any,
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this user');
    }

    const newReport = new this.reportModel({
      reporter: reporterObjId as any,
      reported: reportedObjId as any,
      reason,
      details,
    });
    return newReport.save();
  }
}
