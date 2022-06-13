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

import { FlowerCreateDto } from './dto/flower.create.dto';
import { FlowerDetailDto } from './dto/flower.detail.dto';
import { FlowerFiltersDto } from './dto/flower.filters.dto';
import { FlowerShortDto } from './dto/flower.short.dto';
import { FlowerUpdateDto } from './dto/flower.update.dto';
import { FlowerService } from './flower.service';

@ApiTags('Flower')
@Controller('flower')
export class FlowerController {
  constructor(private readonly flowerService: FlowerService) {}

  @Get()
  @ApiOperation({ summary: 'List/Filter Flower' })
  @ApiFilterQuery('filters', FlowerFiltersDto)
  @ApiPaginatedListResponse({ response: ApiOkResponse, model: FlowerShortDto })
  async list(
    @Query() pagination: PaginatedListQuery,
    @Query('filters') filters: FlowerFiltersDto,
  ): Promise<PaginatedList<FlowerShortDto>> {
    const List = await this.flowerService.flowerPaginate(pagination, filters, {
      count: true,
    });

    return PaginatedList.fromPaginatedListInterface(
      List,
      FlowerShortDto.fromFlowerEntity,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create Flower' })
  @ApiOkResponse({ type: FlowerDetailDto })
  async create(@Body() data: FlowerCreateDto): Promise<FlowerDetailDto> {
    const flowerEntity = await this.flowerService.flowerCreate(data);

    return FlowerDetailDto.fromFlowerEntity(flowerEntity);
  }

  @Get(':flowerId')
  @ApiOperation({ summary: 'Fetch Flower Detail' })
  @ApiOkResponse({ type: FlowerDetailDto })
  async detail(@Param('flowerId') flowerId: string): Promise<FlowerDetailDto> {
    const flowerEntity = await this.flowerService.flowerGet(flowerId);

    return FlowerDetailDto.fromFlowerEntity(flowerEntity);
  }

  @Put(':flowerId')
  @ApiOperation({ summary: 'Update Flower' })
  @ApiOkResponse({ type: FlowerDetailDto })
  async update(
    @Param('flowerId') flowerId: string,
    @Body() data: FlowerUpdateDto,
  ): Promise<FlowerDetailDto> {
    const flowerEntity = await this.flowerService.flowerUpdate(flowerId, data);

    return FlowerDetailDto.fromFlowerEntity(flowerEntity);
  }

  @Delete(':flowerId')
  @ApiOperation({ summary: 'Delete Flower' })
  @ApiOkResponse({ type: StatusResponseDto })
  async delete(
    @Param('flowerId') flowerId: string,
  ): Promise<StatusResponseDto> {
    await this.flowerService.flowerDelete(flowerId);
    return StatusResponseDto.toStatusResponseInterface({
      title: 'Flower Deleted',
      detail: 'The Flower was successfully deleted',
    });
  }
}
