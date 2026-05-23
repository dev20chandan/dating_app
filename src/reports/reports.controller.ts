import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Report a user' })
  @ApiResponse({ status: 201, description: 'User reported successfully' })
  async createReport(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    const reporterId = req.user.id;
    return this.reportsService.createReport(
      reporterId,
      createReportDto.targetUserId,
      createReportDto.reason,
      createReportDto.details,
    );
  }
}
