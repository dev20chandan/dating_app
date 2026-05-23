import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlockUserDto } from './dto/block-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('blocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  async blockUser(@Req() req: any, @Body() blockUserDto: BlockUserDto) {
    const userId = req.user.id;
    return this.blocksService.blockUser(userId, blockUserDto.userIdToBlock);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blocked users' })
  async getBlockedUsers(@Req() req: any) {
    const userId = req.user.id;
    return this.blocksService.getBlockedUsers(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unblock a user' })
  async unblockUser(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.blocksService.unblockUser(userId, id);
  }
}
