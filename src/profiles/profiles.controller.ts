import { Controller, Get, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  async createProfile(@Req() req: any, @Body() createProfileDto: CreateProfileDto) {
    const userId = req.user.id;
    return this.profilesService.createProfile(userId, createProfileDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.profilesService.getProfile(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profilesService.updateProfile(userId, updateProfileDto);
  }
}
