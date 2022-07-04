import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { ReelLikeDetailsDto } from '~modules/reel/dto/reel-like.details.dto';

import { ReelEntity } from './reel.entity';
import { UserEntity } from './user.entity';

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
  @JoinColumn([{ name: 'reel_id', referencedColumnName: 'id' }])
  reel?: ReelEntity;

  @ManyToOne('UserEntity', (user: UserEntity) => user.likes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user?: UserEntity;

  public toReelLikeDetailsDto(): ReelLikeDetailsDto {
    return {
      id: this.id,
      reelId: this.reelId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reel: this.reel?.toReelDetailsDto(),
    };
  }
}
