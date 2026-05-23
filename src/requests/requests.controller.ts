import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a match request' })
  @ApiResponse({ status: 201, description: 'Request sent successfully' })
  async sendRequest(@Req() req: any, @Body() createRequestDto: CreateRequestDto) {
    const senderId = req.user.id;
    return this.requestsService.sendRequest(senderId, createRequestDto.targetUserId);
  }

  @Post('accept/:requestId')
  @ApiOperation({ summary: 'Accept a match request' })
  async acceptRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const userId = req.user.id;
    return this.requestsService.acceptRequest(userId, requestId);
  }

  @Post('reject/:requestId')
  @ApiOperation({ summary: 'Reject a match request' })
  async rejectRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const userId = req.user.id;
    return this.requestsService.rejectRequest(userId, requestId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending match requests' })
  async getPendingRequests(@Req() req: any) {
    const userId = req.user.id;
    return this.requestsService.getPendingRequests(userId);
  }
}
