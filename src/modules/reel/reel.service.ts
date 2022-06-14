import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReelEntity } from '~database/entities/reel.entity';
import { ReelRepository } from '~database/repositories/reel.repository';

import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';

interface ReelFilters {
  name?: string;
  description?: string;
}

@Injectable()
export class ReelService {
  constructor(
    @InjectRepository(ReelRepository)
    private reelRepository: ReelRepository,
  ) {}
  async get(
    pagination: PaginationOptionsInterface,
    filters?: ReelFilters,
    options?: {
      count: boolean;
    },
  ): Promise<PaginatedListInterface<ReelEntity>> {
    //  filter to protect from unwanted non-index orders here
    const order = pagination?.order || [];

    return this.reelRepository.paginate(
      {
        ...pagination,
        order,
      },
      filters,
      options?.count,
    );
  }

  async createReel(body: {
    reelId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    return this.reelRepository.createReel(body);
  }
}
