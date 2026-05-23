import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '../schemas/report.schema';

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @ApiProperty({ enum: ReportReason })
  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason: ReportReason;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  details?: string;
}
