import { IsEnum } from 'class-validator';
import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelDetailsDto } from '~modules/reel/dto/reel.details.dto';
import { ReelStatus } from '~modules/reel/enums/reel-status.enum';

import { ReelLikeEntity } from './reel-like.entity';
import { ReelReportEntity } from './reel-report.entity';
import { ReelViewEntity } from './reel-view.entity';
import { UserEntity } from './user.entity';

@Entity('reel')
export class ReelEntity extends DatabaseEntity {
  @Column({ type: 'uuid' })
  issuerId: string;

  @Column({ unique: true })
  objectId: string;

  @Column({ unique: true })
  jobId: string;

  @Column('enum', {
    nullable: false,
    default: ReelStatus.UPLOAD_SUBMITTED,
    enum: ReelStatus,
  })
  @IsEnum(ReelStatus)
  status: ReelStatus;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne('UserEntity', (user: UserEntity) => user.reels, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'issuer_id', referencedColumnName: 'id' }])
  user?: UserEntity;

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
      objectId: this.objectId,
      jobId: this.jobId,
      status: this.status,
      isVisible: this.isVisible,
      user: this.user?.toUserDetailsDto(),
      likeCount: this.likeCount,
      likes: this.likes?.map((x) => x.toReelLikeDetailsDto()),
      views: this.views?.map((x) => x.toReelViewDetailsDto()),
      reports: this.reports?.map((x) => x.toReelReportDetailsDto()),
    };
  }
}
