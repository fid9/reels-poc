import { IsString } from 'class-validator';

import { ReelEntity } from '~database/entities/reel.entity';

export class ReelDto {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly issuerId: string;

  @IsString()
  public readonly reelId: string;

  static fromReelEntity(reelEntity: ReelEntity): ReelDto {
    return {
      id: reelEntity.id,
      issuerId: reelEntity.issuerId,
      reelId: reelEntity.reelId,
    };
  }
}
