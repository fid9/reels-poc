import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ReelDetailsDto } from './reel.details.dto';

export class ReelReportDetailsDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly userId: string;

  @IsString()
  public readonly reelId: string;

  @IsString()
  public readonly reason: string;

  @IsString()
  public readonly desciption: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @ValidateNested()
  @Type(() => ReelDetailsDto)
  @IsOptional()
  public readonly reel?: ReelDetailsDto;
}
