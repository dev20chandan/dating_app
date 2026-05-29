import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // registore admin 
  @ApiOperation({ summary: 'Admin register' })
  @ApiResponse({ status: 201, description: 'Successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: AdminLoginDto })
  @Post('register')
  async register(@Body() registerDto: AdminLoginDto) {
    return this.adminService.register(registerDto);
  }

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AdminLoginDto })
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(AdminJwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    return this.adminService.findAllUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @UseGuards(AdminJwtAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user profile by ID' })
  @UseGuards(AdminJwtAuthGuard)
  @Get('users/:id/profile')
  async getUserProfile(@Param('id') id: string) {
    return this.adminService.getUserProfile(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @UseGuards(AdminJwtAuthGuard)
  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateUser(id, updateData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @UseGuards(AdminJwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a user' })
  @UseGuards(AdminJwtAuthGuard)
  @Patch('users/:id/block')
  async blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unblock a user' })
  @UseGuards(AdminJwtAuthGuard)
  @Patch('users/:id/unblock')
  async unblockUser(@Param('id') id: string) {
    return this.adminService.unblockUser(id);
  }
}
