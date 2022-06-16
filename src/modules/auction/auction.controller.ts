import { Body, Controller, Param, Post, Put } from '@nestjs/common';

import { ApiResponse } from '~common/endpoint/api.interface';

import { AuctionService } from './auction.service';
import { AuctionCreateDto } from './dto/auction.create.dto';
import { AuctionDetailsDto } from './dto/auction.details.dto';
import { AuctionUpdateDto } from './dto/auction.update.dto';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(
    @Body() body: AuctionCreateDto,
  ): Promise<ApiResponse<AuctionDetailsDto>> {
    return {
      body: (await this.auctionService.create(body)).toAuctionDetailsDto(),
    };
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: AuctionUpdateDto,
  ): Promise<ApiResponse<AuctionDetailsDto>> {
    return {
      body: (await this.auctionService.update(id, body)).toAuctionDetailsDto(),
    };
  }
}
