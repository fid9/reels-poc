import { Entity, Column, OneToMany, OneToOne } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelLikeCountEntity } from './reel-like-count.entity';
import { ReelLikeEntity } from './reel-like.entity';
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
}
