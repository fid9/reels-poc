import { IsDate, IsString } from 'class-validator';

import { ReelEntity } from '~database/entities/reel.entity';

export class ReelDto {
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

  static fromReelEntity(reelEntity: ReelEntity): ReelDto {
    return {
      id: reelEntity.id,
      issuerId: reelEntity.issuerId,
      reelId: reelEntity.reelId,
      createdAt: reelEntity.createdAt,
      updatedAt: reelEntity.updatedAt,
    };
  }
}
