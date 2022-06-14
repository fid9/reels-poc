import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelEntity } from './reel.entity';

@Entity('reel-like')
export class ReelLikeEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  reelId: string;

  @ManyToOne('ReelEntity', (reel: ReelEntity) => reel.likes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reelId', referencedColumnName: 'id' }])
  reel: ReelEntity;
}
