import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelLikeCountDetailsDto } from '~modules/reel/dto/reel-like-count.details.dto';

import { ReelEntity } from './reel.entity';

@Entity('reel-like-count')
export class ReelLikeCountEntity extends DatabaseEntity {
  @Column()
  reelId: string;

  @Column()
  count: number;

  @OneToOne('ReelEntity', (reel: ReelEntity) => reel.likeCount, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reelId', referencedColumnName: 'id' }])
  reel?: ReelEntity;

  public toReelLikeCountDetailsDto(): ReelLikeCountDetailsDto {
    return {
      id: this.id,
      reelId: this.reelId,
      count: this.count,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reel: this.reel?.toReelDetailsDto(),
    };
  }
}
