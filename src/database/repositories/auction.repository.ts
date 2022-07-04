import { NotFoundException } from '@nestjs/common';
import { EntityRepository } from 'typeorm';

import { AuctionEntity } from '~database/entities/auction.entity';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

import { ForbiddenException } from '~common/exceptions';

@EntityRepository(AuctionEntity)
export class AuctionRepository extends PostgresBaseRepository<AuctionEntity> {
  public async createAuction(body: {
    issuerId: string;
    isLive: boolean;
  }): Promise<AuctionEntity> {
    const existingAuction = await this.findOne({
      where: {
        issuerId: body.issuerId,
      },
    });

    if (existingAuction) {
      throw new ForbiddenException('Auction already exists for user!');
    }

    const auctionEntity = new AuctionEntity();
    auctionEntity.isLive = body.isLive;
    auctionEntity.issuerId = body.issuerId;
    auctionEntity.currentPrice = 0;
    auctionEntity.percentageNumber = 0;

    return this.save(auctionEntity);
  }

  public async updateAuction(
    auctionId: string,
    body: {
      isLive?: boolean;
      currentPrice?: number;
      percentageNumber?: number;
    },
  ): Promise<AuctionEntity> {
    const auctionEntity = await this.findOne(auctionId);

    if (!auctionEntity) {
      throw new NotFoundException('Auction not found!');
    }

    if (body.isLive !== undefined) {
      auctionEntity.isLive = body.isLive;
    }

    if (body.currentPrice !== undefined) {
      auctionEntity.currentPrice = body.currentPrice;
    }

    if (body.percentageNumber !== undefined) {
      auctionEntity.percentageNumber = body.percentageNumber;
    }

    return this.save(auctionEntity);
  }
}
