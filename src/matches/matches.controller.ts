import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all matches for current user' })
  @ApiResponse({ status: 200, description: 'Return all matches' })
  async getMatches(@Req() req: any) {
    const userId = req.user.id;
    return this.matchesService.getMatches(userId);
  }
}
