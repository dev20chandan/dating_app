import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number to send OTP to' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email to send OTP to' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number the OTP was sent to' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email the OTP was sent to' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456', description: 'The 6-digit OTP' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
