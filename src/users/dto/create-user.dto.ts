import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsUrl, MaxLength, IsIn, ArrayMaxSize, ArrayMinSize, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'The email of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'The phone number of the user' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user (min 6 chars)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'serious', description: 'Relationship intent' })
  @IsOptional()
  @IsString()
  @IsIn(['dating', 'serious', 'marriage'])
  intent?: string;

  @ApiPropertyOptional({ example: '1995-05-24', description: 'Date of birth' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ example: 'female', description: 'Gender identity' })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'non-binary'])
  identity?: string;

  @ApiPropertyOptional({ example: ['https://example.com/photo1.jpg'], description: 'Array of photo URLs' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(9)
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4', description: 'Video intro URL' })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ example: ['Travel', 'Gaming'], description: 'User interests' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 'I love to travel and play games.', description: 'User bio' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: [18, 30], description: 'Age range of ideal match [min, max]' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  matchAgeRange?: number[];

  @ApiPropertyOptional({ example: 50, description: 'Maximum distance in miles for ideal match' })
  @IsOptional()
  @Min(1)
  @Max(100)
  matchDistance?: number;
}
