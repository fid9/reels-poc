import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelReportDetailsDto } from '~modules/reel/dto/reel-report.details.dto';

import { ReelEntity } from './reel.entity';

@Entity('reel-report')
export class ReelReportEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  reelId: string;

  @Column()
  reason: string;

  @Column()
  description: string;

  @ManyToOne('ReelEntity', (reel: ReelEntity) => reel.reports, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reel_id', referencedColumnName: 'id' }])
  reel?: ReelEntity;

  public toReelReportDetailsDto(): ReelReportDetailsDto {
    return {
      id: this.id,
      userId: this.userId,
      reelId: this.reelId,
      reason: this.reason,
      desciption: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reel: this.reel?.toReelDetailsDto(),
    };
  }
}
