import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginatedList, PaginatedListQuery } from '~database/utils';

import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { ApiFilterQuery } from '~common/handlers/open-api/api-filter-query';
import { StatusResponseDto } from '~common/handlers/request/status-response.dto';

import { FlowerGenusCreateDto } from './dto/flower-genus.create.dto';
import { FlowerGenusDetailDto } from './dto/flower-genus.detail.dto';
import { FlowerGenusFiltersDto } from './dto/flower-genus.filters.dto';
import { FlowerGenusShortDto } from './dto/flower-genus.short.dto';
import { FlowerGenusUpdateDto } from './dto/flower-genus.update.dto';
import { FlowerService } from './flower.service';

@ApiTags('Flower Genus')
@Controller('flower-genus')
export class FlowerGenusController {
  constructor(private readonly flowerService: FlowerService) {}

  @Get()
  @ApiOperation({ summary: 'List/Filter Genus' })
  @ApiPaginatedListResponse({
    response: ApiOkResponse,
    model: FlowerGenusShortDto,
  })
  @ApiFilterQuery('filters', FlowerGenusFiltersDto)
  async list(
    @Query() pagination: PaginatedListQuery,
    @Query('filters') filters: FlowerGenusFiltersDto,
  ): Promise<PaginatedList<FlowerGenusShortDto>> {
    const genusList = await this.flowerService.genusPaginate(
      pagination,
      filters,
      { count: true },
    );

    return PaginatedList.fromPaginatedListInterface(
      genusList,
      FlowerGenusShortDto.fromFlowerGenusEntity,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create Genus' })
  @ApiOkResponse({ type: FlowerGenusDetailDto })
  async create(
    @Body() data: FlowerGenusCreateDto,
  ): Promise<FlowerGenusDetailDto> {
    const genusEntity = await this.flowerService.genusCreate(data);

    return FlowerGenusDetailDto.fromFlowerGenusEntity(genusEntity);
  }

  @Get(':genusId')
  @ApiOperation({ summary: 'Fetch Genus Detail' })
  @ApiOkResponse({ type: FlowerGenusDetailDto })
  async detail(
    @Param('genusId') genusId: string,
  ): Promise<FlowerGenusDetailDto> {
    const genusEntity = await this.flowerService.genusGet(genusId);

    return FlowerGenusDetailDto.fromFlowerGenusEntity(genusEntity);
  }

  @Put(':genusId')
  @ApiOperation({ summary: 'Update Genus' })
  @ApiOkResponse({ type: FlowerGenusDetailDto })
  async update(
    @Param('genusId') genusId: string,
    @Body() data: FlowerGenusUpdateDto,
  ): Promise<FlowerGenusDetailDto> {
    const genusEntity = await this.flowerService.genusUpdate(genusId, data);

    return FlowerGenusDetailDto.fromFlowerGenusEntity(genusEntity);
  }

  @Delete(':genusId')
  @ApiOperation({ summary: 'Delete Genus' })
  @ApiOkResponse({ type: StatusResponseDto })
  async delete(@Param('genusId') genusId: string): Promise<StatusResponseDto> {
    await this.flowerService.genusDelete(genusId);

    return StatusResponseDto.toStatusResponseInterface({
      title: 'Genus Deleted',
      detail: 'The Flower Genus was successfully deleted',
    });
  }
}
