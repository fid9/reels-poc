import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { AuctionDetailsDto } from '~modules/auction/dto/auction.details.dto';

import { UserEntity } from './user.entity';

@Entity('auction')
export class AuctionEntity extends DatabaseEntity {
  @Column()
  isLive: boolean;

  @Column()
  issuerId: string;

  @Column()
  currentPrice: number;

  @Column()
  percentageNumber: number;

  @OneToOne(() => UserEntity, (user) => user.auction, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: false,
  })
  @JoinColumn()
  user?: UserEntity;

  public toAuctionDetailsDto(): AuctionDetailsDto {
    return {
      id: this.id,
      isLive: this.isLive,
      issuerId: this.issuerId,
      currentPrice: this.currentPrice,
      percentageNumber: this.percentageNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
