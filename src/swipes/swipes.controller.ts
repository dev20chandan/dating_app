import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SwipesService } from './swipes.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Post(':targetUserId')
  @ApiOperation({ summary: 'Swipe on a user' })
  @ApiResponse({ status: 201, description: 'Swipe recorded successfully' })
  async createSwipe(
    @Req() req: any,
    @Param('targetUserId') targetUserId: string,
    @Body() createSwipeDto: CreateSwipeDto,
  ) {
    const sourceUserId = req.user.id;
    return this.swipesService.createSwipe(sourceUserId, targetUserId, createSwipeDto.type);
  }
}
