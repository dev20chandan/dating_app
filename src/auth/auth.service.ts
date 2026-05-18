import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>
  ) { }

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhone(identifier);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = (user as any).toObject ? (user as any).toObject() : user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, phoneNumber: user.phoneNumber, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const identifier = createUserDto.email || createUserDto.phoneNumber;
    if (!identifier) {
      throw new ConflictException('Email or Phone Number is required');
    }
    const existingUser = await this.usersService.findByEmailOrPhone(identifier);
    if (existingUser) {
      throw new ConflictException('Email or Phone Number already in use');
    }
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = (user as any).toObject ? (user as any).toObject() : user;
    return result;
  }

  async sendOtp(identifier: string) {
    if (!identifier) {
      throw new BadRequestException('Phone number or email is required');
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this identifier
    await this.otpModel.deleteMany({ identifier });

    // Save new OTP
    const newOtp = new this.otpModel({
      identifier,
      otp: otpCode,
    });
    await newOtp.save();

    // In a real application, you would send the OTP via SMS or Email here.
    // For now, we'll log it to the console for development.
    console.log(`[DEV ONLY] OTP for ${identifier} is ${otpCode}`);

    return { message: 'OTP sent successfully', body: { otpCode } };
  }

  async verifyOtp(identifier: string, otpCode: string) {
    if (!identifier || !otpCode) {
      throw new BadRequestException('Identifier and OTP are required');
    }

    const otpRecord = await this.otpModel.findOne({ identifier, otp: otpCode });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check if OTP is expired
    const now = new Date();
    const expiryTime = new Date(otpRecord.createdAt.getTime() + 5 * 60000); // 5 mins
    if (now > expiryTime) {
      await this.otpModel.deleteOne({ _id: otpRecord._id });
      throw new BadRequestException('OTP has expired');
    }

    // If valid, delete the OTP so it can't be reused
    await this.otpModel.deleteOne({ _id: otpRecord._id });

    return { success: true, message: 'OTP verified successfully' };
  }
}
