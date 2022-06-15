import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { PaginatedList, PaginatedListQuery } from '~database/utils';

import { ApiResponse } from '~common/endpoint/api.interface';

import { ReelFiltersDto } from './dto/reel-filters.dto';
import { ReelCreateDto } from './dto/reel.create.dto';
import { ReelDto } from './dto/reel.dto';
import { ReelLikeDto } from './dto/reel.like.dto';
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

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.reelService.deleteReel(id);
  }

  @Post('/likes')
  async likeReel(@Body() body: ReelLikeDto): Promise<void> {
    await this.reelService.likeReel(body);
  }

  @Delete('/likes/:id')
  async unlikeReel(@Param('id') id: string): Promise<void> {
    const reelId = id.substring(0, id.indexOf('_'));
    const userId = id.substring(id.indexOf('_') + 1, id.length);
    await this.reelService.unlikeReel(reelId, userId);
  }
}
