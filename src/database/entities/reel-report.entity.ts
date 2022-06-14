import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelEntity } from './reel.entity';

@Entity('reel-report')
export class ReelReportEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  reelId: string;

  @ManyToOne('ReelEntity', (reel: ReelEntity) => reel.reports, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reelId', referencedColumnName: 'id' }])
  reel: ReelEntity;

  @Column()
  reason: string;

  @Column()
  description: string;
}
