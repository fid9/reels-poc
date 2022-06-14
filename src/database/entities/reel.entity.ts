import { Entity, Column, OneToMany, OneToOne } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelDto } from '~modules/reel/dto/reel.dto';

import { ReelLikeCountEntity } from './reel-like-count.entity';
import { ReelLikeEntity } from './reel-like.entity';
import { ReelReportEntity } from './reel-report.entity';
import { ReelViewEntity } from './reel-view.entity';

@Entity('reel')
export class ReelEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  issuerId: string;

  @Column()
  reelId: string;

  @OneToOne(
    'ReelLikeCountEntity',
    (likeCount: ReelLikeCountEntity) => likeCount.reel,
  )
  likeCount: ReelLikeCountEntity;

  @OneToMany('ReelLikeEntity', (like: ReelLikeEntity) => like.reel)
  likes: ReelLikeEntity[];

  @OneToMany('ReelViewEntity', (view: ReelViewEntity) => view.reel)
  views: ReelViewEntity[];

  @OneToMany('ReelReportEntity', (report: ReelReportEntity) => report.reel)
  reports: ReelReportEntity[];

  public toReelDetailsDto(): ReelDto {
    return {
      id: this.id,
      issuerId: this.issuerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reelId: this.reelId,
    };
  }
}
