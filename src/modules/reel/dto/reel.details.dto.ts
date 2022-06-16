import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ReelEntity } from '~database/entities/reel.entity';

import { UserDetailsDto } from '~modules/user/dto/user.details.dto';

import { ReelLikeCountDetailsDto } from './reel-like-count.details.dto';
import { ReelLikeDetailsDto } from './reel-like.details.dto';
import { ReelReportDetailsDto } from './reel-report.details.dto';
import { ReelViewDetailsDto } from './reel-view.details.dto';

export class ReelDetailsDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly issuerId: string;

  @IsString()
  public readonly reelId: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @ValidateNested()
  @Type(() => UserDetailsDto)
  @IsOptional()
  public readonly user?: UserDetailsDto;

  @ValidateNested()
  @Type(() => ReelLikeCountDetailsDto)
  @IsOptional()
  public readonly likeCount?: ReelLikeCountDetailsDto;

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
      reelId: reelEntity.reelId,
      createdAt: reelEntity.createdAt,
      updatedAt: reelEntity.updatedAt,
      user: reelEntity.user?.toUserDetailsDto(),
      likeCount: reelEntity.likeCount?.toReelLikeCountDetailsDto(),
      likes: reelEntity.likes?.map((x) => x.toReelLikeDetailsDto()),
      views: reelEntity.views?.map((x) => x.toReelViewDetailsDto()),
      reports: reelEntity.reports?.map((x) => x.toReelReportDetailsDto()),
    };
  }
}
