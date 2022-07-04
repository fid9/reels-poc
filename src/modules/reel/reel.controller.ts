import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';

import { PaginatedList, PaginatedListQuery } from '~database/utils';

import { ApiResponse } from '~common/endpoint/api.interface';
import { UserDetailsDto } from '~modules/user/dto/user.details.dto';

import { ReelCreateDto } from './dto/reel.create.dto';
import { ReelDetailsDto } from './dto/reel.details.dto';
import { ReelLikeDto } from './dto/reel.like.dto';
import { ReelService } from './reel.service';

@Controller('reels')
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @Get()
  async listReels(
    @Query() pagination: PaginatedListQuery,
  ): Promise<PaginatedList<UserDetailsDto>> {
    const List = await this.reelService.getList(pagination);

    return PaginatedList.fromPaginatedListInterface(
      List,
      UserDetailsDto.fromUserEntity,
    );
  }

  @Get('/:issuerId')
  async listIssuerReels(
    @Param('issuerId') issuerId: string,
    @Query() pagination: PaginatedListQuery,
  ): Promise<PaginatedList<ReelDetailsDto>> {
    const List = await this.reelService.getIssuerList(issuerId, pagination);

    return PaginatedList.fromPaginatedListInterface(
      List,
      ReelDetailsDto.fromReelEntity,
    );
  }

  @Post('/job-state-change')
  // @Header('content-type', 'text/plain; charset=UTF-8')
  async handleJobStateChange(@Request() request: any): Promise<void> {
    const event = JSON.parse(request.rawBody);
    const message = JSON.parse(event.Message);
    await this.reelService.updateReelUploadStatus(message.detail.jobId, {
      status: message.detail.status,
    });
  }

  @Post()
  async create(
    @Body() body: ReelCreateDto,
  ): Promise<ApiResponse<ReelDetailsDto>> {
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
    await this.reelService.unlikeReel(id);
  }
}
