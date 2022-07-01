import { IsEnum } from 'class-validator';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelDetailsDto } from '~modules/reel/dto/reel.details.dto';
import { ReelStatus } from '~modules/reel/enums/reel-status.enum';
import { ReelUploadStatus } from '~modules/reel/enums/reel-upload-status.enum';

import { ReelLikeCountEntity } from './reel-like-count.entity';
import { ReelLikeEntity } from './reel-like.entity';
import { ReelReportEntity } from './reel-report.entity';
import { ReelViewEntity } from './reel-view.entity';
import { UserEntity } from './user.entity';

@Entity('reel')
export class ReelEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  issuerId: string;

  @Column()
  reelId: string;

  @Column()
  jobId: string;

  @Column('enum', {
    nullable: false,
    default: ReelStatus.SUBMITTED,
    enum: ReelStatus,
  })
  @IsEnum(ReelStatus)
  status: ReelStatus;

  @Column('enum', {
    nullable: false,
    default: ReelUploadStatus.SUBMITTED,
    enum: ReelUploadStatus,
  })
  @IsEnum(ReelStatus)
  uploadStatus: ReelUploadStatus;

  @Column({ default: true })
  isVisible: boolean;

  @ManyToOne('UserEntity', (user: UserEntity) => user.reels, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'issuerId', referencedColumnName: 'id' }])
  user?: UserEntity;

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

  public toReelDetailsDto(): ReelDetailsDto {
    return {
      id: this.id,
      issuerId: this.issuerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reelId: this.reelId,
      status: this.status,
      isVisible: this.isVisible,
      uploadStatus: this.uploadStatus,
      user: this.user?.toUserDetailsDto(),
      likeCount: this.likeCount?.toReelLikeCountDetailsDto(),
      likes: this.likes?.map((x) => x.toReelLikeDetailsDto()),
      views: this.views?.map((x) => x.toReelViewDetailsDto()),
      reports: this.reports?.map((x) => x.toReelReportDetailsDto()),
    };
  }
}
