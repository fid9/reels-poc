import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuctionRepository } from '~database/repositories/auction.repository';

import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionRepository])],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
