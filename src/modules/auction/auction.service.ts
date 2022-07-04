import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuctionEntity } from '~database/entities/auction.entity';
import { AuctionRepository } from '~database/repositories/auction.repository';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionRepository)
    private auctionRepository: AuctionRepository,
  ) {}

  async create(body: {
    issuerId: string;
    isLive: boolean;
  }): Promise<AuctionEntity> {
    return this.auctionRepository.createAuction(body);
  }

  async update(
    auctionId: string,
    body: {
      isLive?: boolean;
      percentageNumber?: number;
      currentPrice?: number;
    },
  ): Promise<AuctionEntity> {
    return this.auctionRepository.updateAuction(auctionId, body);
  }
}
