import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

@Entity('reel')
export class ReelEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  issuerId: string;

  @Column()
  reelId: string;
}
