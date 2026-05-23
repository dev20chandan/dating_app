import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('interests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an interest' })
  @ApiResponse({ status: 201, description: 'Interest created successfully' })
  async createInterest(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.createInterest(createInterestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all interests' })
  async getAllInterests() {
    return this.interestsService.getAllInterests();
  }
}
