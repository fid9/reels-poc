import { EntityRepository } from 'typeorm';

import { FlowerGenusEntity } from '~database/entities';
import { paginateQueryBuilder } from '~database/utils/list.helper';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';

@EntityRepository(FlowerGenusEntity)
export class FlowerGenusRepository extends PostgresBaseRepository<FlowerGenusEntity> {
  /**
   * A repository is the glue between a service and an persistence layer. It should:
   * - contain database specific code, including SQL and ORM methods
   * - include other repositories as needed (relational databases do this implicitly)
   * - not include any services or higher layers
   * - not include business logic
   */
  public async paginate(
    pagination: PaginationOptionsInterface,
    filters: { name?: string; description?: string } = {},
    count = false,
  ): Promise<PaginatedListInterface<FlowerGenusEntity>> {
    let query = this.createQueryBuilder('flowerGenus');

    if (filters.description) {
      query = query.andWhere(
        'LOWER(flowerGenus.description) LIKE :description',
        {
          description: `%${filters.description.toLowerCase()}%`,
        },
      );
    }

    if (filters.name) {
      query = query.andWhere('LOWER(flowerGenus.name) LIKE :name', {
        name: `%${filters.name.toLowerCase()}%`,
      });
    }

    return {
      filters: { ...filters },
      ...(await paginateQueryBuilder(query, pagination, count)),
    };
  }
}
