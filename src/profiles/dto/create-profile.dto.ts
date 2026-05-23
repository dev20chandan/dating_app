import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LocationDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  @IsOptional()
  type?: string = 'Point';

  @ApiProperty({ example: [-73.935242, 40.730610], description: '[longitude, latitude]' })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'NON_BINARY'] })
  @IsEnum(['MALE', 'FEMALE', 'NON_BINARY'])
  gender: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'NON_BINARY', 'EVERYONE'] })
  @IsEnum(['MALE', 'FEMALE', 'NON_BINARY', 'EVERYONE'])
  interestedIn: string;

  @ApiProperty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  occupation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  education?: string;

  @ApiPropertyOptional({ enum: ['LONG_TERM', 'SHORT_TERM', 'NEW_FRIENDS', 'NOT_SURE'] })
  @IsEnum(['LONG_TERM', 'SHORT_TERM', 'NEW_FRIENDS', 'NOT_SURE'])
  @IsOptional()
  relationshipGoal?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}
