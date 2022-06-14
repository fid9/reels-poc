import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { PaginatedList, PaginatedListQuery } from '~database/utils';

import { ApiResponse } from '~common/endpoint/api.interface';

import { ReelFiltersDto } from './dto/reel-filters.dto';
import { ReelCreateDto } from './dto/reel.create.dto';
import { ReelDto } from './dto/reel.dto';
import { ReelService } from './reel.service';

@Controller('reels')
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @Get()
  async list(
    @Query() pagination: PaginatedListQuery,
    @Query('filters') filters: ReelFiltersDto,
  ): Promise<PaginatedList<ReelDto>> {
    const List = await this.reelService.get(pagination, filters, {
      count: true,
    });

    return PaginatedList.fromPaginatedListInterface(
      List,
      ReelDto.fromReelEntity,
    );
  }

  @Post()
  async create(@Body() body: ReelCreateDto): Promise<ApiResponse<ReelDto>> {
    return {
      body: (await this.reelService.createReel(body)).toReelDetailsDto(),
    };
  }
}
