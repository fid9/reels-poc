import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelEntity } from './reel.entity';

@Entity('reel-view')
export class ReelViewEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  reelId: string;

  @ManyToOne('ReelEntity', (reel: ReelEntity) => reel.views, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reelId', referencedColumnName: 'id' }])
  reel: ReelEntity;

  @Column()
  duration: number;

  @Column()
  viewStatus: string;
}
