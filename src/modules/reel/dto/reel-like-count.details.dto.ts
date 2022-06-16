import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ReelDetailsDto } from './reel.details.dto';

export class ReelLikeCountDetailsDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly reelId: string;

  @IsNumber()
  public readonly count: number;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @ValidateNested()
  @Type(() => ReelDetailsDto)
  @IsOptional()
  public readonly reel?: ReelDetailsDto;
}
