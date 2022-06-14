import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

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
  reel: ReelEntity;
}
