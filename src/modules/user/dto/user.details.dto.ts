import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { UserEntity } from '~database/entities/user.entity';

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
  @IsOptional()
  readonly createdAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly updatedAt?: Date;

  @ValidateNested({ each: true })
  @Type(() => ReelDetailsDto)
  @IsOptional()
  readonly reels?: ReelDetailsDto[];

  static fromUserEntity(userEntity: UserEntity): UserDetailsDto {
    return {
      id: userEntity.id,
      type: userEntity.type,
      username: userEntity.username,
      displayName: userEntity.displayName,
      isVerified: userEntity.isVerified,
      reels: userEntity.reels?.map((x) => x.toReelDetailsDto()),
    };
  }
}
