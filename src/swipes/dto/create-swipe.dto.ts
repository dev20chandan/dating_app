import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SwipeType } from '../schemas/swipe.schema';

export class CreateSwipeDto {
  @ApiProperty({ enum: SwipeType })
  @IsEnum(SwipeType)
  @IsNotEmpty()
  type: SwipeType;
}
