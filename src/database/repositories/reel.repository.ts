import { EntityRepository } from 'typeorm';

import { ReelEntity } from '~database/entities/reel.entity';
import { paginateQueryBuilder } from '~database/utils/list.helper';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';

@EntityRepository(ReelEntity)
export class ReelRepository extends PostgresBaseRepository<ReelEntity> {
  public async paginate(
    pagination: PaginationOptionsInterface,
    filters: { name?: string; description?: string } = {},
    count = false,
  ): Promise<PaginatedListInterface<ReelEntity>> {
    let query = this.createQueryBuilder('reel');

    if (filters.description) {
      query = query.andWhere('LOWER(flower.description) LIKE :description', {
        description: `%${filters.description.toLowerCase()}%`,
      });
    }

    if (filters.name) {
      query = query.andWhere('LOWER(flower.name) LIKE :name', {
        name: `%${filters.name.toLowerCase()}%`,
      });
    }

    return {
      filters,
      ...(await paginateQueryBuilder(query, pagination, count)),
    };
  }

  public async createReel(body: {
    reelId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    const reelEntity = new ReelEntity();
    reelEntity.reelId = body.reelId;
    reelEntity.issuerId = body.issuerId;

    return this.save(reelEntity);
  }
}
