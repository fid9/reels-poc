import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ReelDetailsDto } from '~modules/reel/dto/reel.details.dto';

export class UserDetailsDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly type: string;

  @IsBoolean()
  readonly isVerified: boolean;

  @IsString()
  readonly username: string;

  @IsString()
  readonly displayName: string;

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;

  @ValidateNested({ each: true })
  @Type(() => ReelDetailsDto)
  @IsOptional()
  readonly reels?: ReelDetailsDto[];
}
