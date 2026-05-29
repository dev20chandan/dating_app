import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private jwtService: JwtService,
  ) { }

  // registore admin 
  async register(registerDto: AdminLoginDto) {
    const { email, password } = registerDto;
    const existingAdmin = await this.adminModel.findOne({ email }).exec();
    if (existingAdmin) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.adminModel.create({
      email,
      password: hashedPassword,
    });
    return admin;
  }

  async login(loginDto: AdminLoginDto) {
    const admin = await this.adminModel.findOne({ email: loginDto.email }).exec();
    if (!admin || !admin.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin._id, email: admin.email, role: 'ADMIN' };
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin._id,
        email: admin.email,
      }
    };
  }

  // --- User Management ---

  async findAllUsers() {
    return this.userModel.find().select('-password').exec();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserProfile(id: string) {
    const profile = await this.profileModel.findOne({ userId: id as any }).exec();
    return profile || null;
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async blockUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async unblockUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
