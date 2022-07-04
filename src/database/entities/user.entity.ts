import { Entity, Column, OneToOne, OneToMany } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { UserDetailsDto } from '~modules/user/dto/user.details.dto';

import { AuctionEntity } from './auction.entity';
import { ReelLikeEntity } from './reel-like.entity';
import { ReelEntity } from './reel.entity';

@Entity('user')
export class UserEntity extends DatabaseEntity {
  @Column()
  type: string;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column()
  isVerified: boolean;

  @OneToOne(() => AuctionEntity, (auction) => auction.user, {
    cascade: ['insert', 'update', 'remove'],
    nullable: true,
  })
  auction?: AuctionEntity;

  @OneToMany('ReelEntity', (reel: ReelEntity) => reel.user)
  reels?: ReelEntity[];

  @OneToMany('ReelLikeEntity', (like: ReelLikeEntity) => like.user)
  likes?: ReelLikeEntity[];

  public toUserDetailsDto(): UserDetailsDto {
    return {
      id: this.id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      username: this.username,
      displayName: this.displayName,
      isVerified: this.isVerified,
    };
  }
}
