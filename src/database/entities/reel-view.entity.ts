import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelViewDetailsDto } from '~modules/reel/dto/reel-view.details.dto';

import { ReelEntity } from './reel.entity';

@Entity('reel-view')
export class ReelViewEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  reelId: string;

  @Column()
  duration: number;

  @Column()
  viewStatus: string;

  @ManyToOne('ReelEntity', (reel: ReelEntity) => reel.views, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reel_id', referencedColumnName: 'id' }])
  reel?: ReelEntity;

  public toReelViewDetailsDto(): ReelViewDetailsDto {
    return {
      id: this.id,
      userId: this.userId,
      reelId: this.reelId,
      duration: this.duration,
      viewStatus: this.viewStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reel: this.reel?.toReelDetailsDto(),
    };
  }
}
