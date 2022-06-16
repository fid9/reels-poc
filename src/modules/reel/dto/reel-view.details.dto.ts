import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ReelDetailsDto } from './reel.details.dto';

export class ReelViewDetailsDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly userId: string;

  @IsNumber()
  public readonly duration: number;

  @IsString()
  public readonly viewStatus: string;

  @IsString()
  public readonly reelId: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @ValidateNested()
  @Type(() => ReelDetailsDto)
  @IsOptional()
  public readonly reel?: ReelDetailsDto;
}
