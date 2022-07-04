import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ReelEntity } from '~database/entities/reel.entity';

import { UserDetailsDto } from '~modules/user/dto/user.details.dto';

import { ReelStatus } from '../enums/reel-status.enum';
import { ReelLikeDetailsDto } from './reel-like.details.dto';
import { ReelReportDetailsDto } from './reel-report.details.dto';
import { ReelViewDetailsDto } from './reel-view.details.dto';

export class ReelDetailsDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly issuerId: string;

  @IsString()
  public readonly jobId: string;

  @IsString()
  public readonly objectId: string;

  @IsEnum(ReelStatus)
  public readonly status: ReelStatus;

  @IsBoolean()
  public readonly isVisible: boolean;

  @IsNumber()
  public readonly likeCount: number;

  @IsDate()
  @IsOptional()
  public readonly createdAt?: Date;

  @IsDate()
  @IsOptional()
  public readonly updatedAt?: Date;

  @ValidateNested()
  @Type(() => UserDetailsDto)
  @IsOptional()
  public readonly user?: UserDetailsDto;

  @ValidateNested({ each: true })
  @Type(() => ReelLikeDetailsDto)
  @IsOptional()
  public readonly likes?: ReelLikeDetailsDto[];

  @ValidateNested({ each: true })
  @Type(() => ReelViewDetailsDto)
  @IsOptional()
  public readonly views?: ReelViewDetailsDto[];

  @ValidateNested({ each: true })
  @Type(() => ReelReportDetailsDto)
  @IsOptional()
  public readonly reports?: ReelReportDetailsDto[];

  static fromReelEntity(reelEntity: ReelEntity): ReelDetailsDto {
    return {
      id: reelEntity.id,
      issuerId: reelEntity.issuerId,
      objectId: reelEntity.objectId,
      jobId: reelEntity.jobId,
      status: reelEntity.status,
      isVisible: reelEntity.isVisible,
      createdAt: reelEntity.createdAt,
      likeCount: reelEntity.likeCount,
      user: reelEntity.user?.toUserDetailsDto(),
      likes: reelEntity.likes?.map((x) => x.toReelLikeDetailsDto()),
      views: reelEntity.views?.map((x) => x.toReelViewDetailsDto()),
      reports: reelEntity.reports?.map((x) => x.toReelReportDetailsDto()),
    };
  }
}
