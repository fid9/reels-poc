import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import {
  FlowerEntity,
  FlowerGenusEntity,
  FlowerRelation,
} from '~database/entities';
import {
  FlowerGenusRepository,
  FlowerRepository,
} from '~database/repositories';
import {
  ConstraintException,
  ConstraintType,
} from '~database/utils/postgres.base-repository';

import { BadRequestException, ConflictException } from '~common/exceptions';
import {
  ListOrderType,
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';
import { makeUUID } from '~utils/uuid';

import { FLOWER_CONFIG, FlowerConfig } from './flower.config';

interface FlowerGenusFilters {
  name?: string;
  description?: string;
}

interface FlowerFilters {
  name?: string;
  description?: string;
}

@Injectable()
export class FlowerService {
  constructor(
    @Inject(FLOWER_CONFIG) private appConfig: FlowerConfig,

    @InjectEntityManager()
    private entityManger: EntityManager,

    @InjectRepository(FlowerGenusRepository)
    private flowerGenusRepository: FlowerGenusRepository,

    @InjectRepository(FlowerRepository)
    private flowerRepository: FlowerRepository,
  ) {}

  /**
   * This example shows how to make a generic page pagination
   *  - paginateQueryBuilder will handle offsets and ordering by fields
   *  - filtering needs to be handled in the service (or repository)
   */
  async genusPaginate(
    pagination: PaginationOptionsInterface,
    filters?: FlowerGenusFilters,
    options?: {
      count: boolean;
    },
  ): Promise<PaginatedListInterface<FlowerGenusEntity>> {
    //  filter to protect from unwanted non-index orders here
    const order = pagination?.order || [];

    return this.flowerGenusRepository.paginate(
      {
        ...pagination,
        order,
      },
      filters,
      options?.count,
    );
  }

  /**
   * This example shows how to convert exceptions from TypeORM to app specific ones
   *  - non app-specific exceptions get thrown as a generic 500 error
   */
  async genusGet(id: string): Promise<FlowerGenusEntity> {
    return await this.flowerGenusRepository.findOneOrFail(id);
  }

  /**
   * This example shows how to re-use a method for a one-off and a transaction
   *  use-case, also note how we can test for specific constraints and convert
   *  them to proper Exceptions
   *
   * An alternative that skips TypeORM hooks for a faster (unmanaged) insert
   *  await manager
   *    .getCustomRepository(FlowerGenusRepository)
   *    .createQueryBuilder('flowerGenus')
   *    .insert()
   *    .into(FlowerGenusEntity)
   *    .values(this._genus)
   *    .returning(['updatedDate', 'createdDate', 'version'])
   *    .updateEntity(true)
   *    .execute();
   */
  async genusCreate(
    data: {
      id?: string;
      name?: string;
      description?: string;
    },
    flowerGenusRepository: FlowerGenusRepository = this.flowerGenusRepository,
  ): Promise<FlowerGenusEntity> {
    /**
     * Note that using `.create` only creates an instance that still needs
     *  to be saved
     */
    const genus = flowerGenusRepository.create({
      id: data.id || makeUUID(),
      name: data.name,
      description: data.description,
    });
    try {
      /**
       * Note that calling `await entityManager.insert(FlowerGenusEntity, genus);`
       *  will NOT use the custom repository FlowerGenusRepository
       */
      await flowerGenusRepository.insert(genus);
    } catch (e) {
      if (
        e instanceof ConstraintException &&
        e.constraint_type === ConstraintType.UNIQUE_CONSTRAINT
      ) {
        throw new BadRequestException('Genus already exists');
      }
      throw e;
    }
    return genus;
  }

  /**
   * This example shows how to use versioning to prevent concurrency issues
   *  - this can be moved to a repo or handler
   *
   * An alternative with using update, if a response is not required
   *  const update = await flowerGenusRepository.update(
   *    { id, version: data.version },
   *    { name: data.name, description: data.description, },
   *  );
   *
   */
  async genusUpdate(
    id: string,
    data: {
      name?: string;
      description?: string;
      version: number;
    },
  ): Promise<FlowerGenusEntity> {
    const genusEntity = await this.flowerGenusRepository.findOneOrFail({
      where: { id, version: data.version },
    });

    if (data.name !== undefined) {
      genusEntity.name = data.name;
    }
    if (data.description !== undefined) {
      genusEntity.description = data.description;
    }

    return await this.flowerGenusRepository.save(genusEntity);
  }

  /**
   * Example for deleting
   *  - .remove will not check if the entity does not exist anymore
   *  - .remove will not check if .version changed
   *  - .delete will ignore ALL relations or other protections
   */
  async genusDelete(id: string, data?: { version?: number }): Promise<void> {
    // note: be careful with .delete, it does not check relations
    await this.entityManger.transaction(async (entityManager) => {
      const flowerGenusRepository = entityManager.getCustomRepository(
        FlowerGenusRepository,
      );
      const parameters = data?.version ? { id, version: data.version } : { id };
      const flowerGenusEntity = await flowerGenusRepository.findOneOrFail(
        parameters,
      );
      try {
        await flowerGenusRepository.remove(flowerGenusEntity);
      } catch (e) {
        if (
          e instanceof ConstraintException &&
          e.constraint_name === 'fk_flower_genus_id_flower_genus_id'
        ) {
          throw new ConflictException('Can not delete Genus with Flowers');
        }
        throw e;
      }
    });
  }

  /**
   * This example shows how to make a generic page pagination
   *  - paginateQueryBuilder will handle offsets and ordering by fields
   *  - filtering needs to be handled in the service (or repository)
   */
  async flowerPaginate(
    pagination: PaginationOptionsInterface,
    filters?: FlowerFilters,
    options?: {
      count: boolean;
    },
  ): Promise<PaginatedListInterface<FlowerEntity>> {
    //  filter to protect from unwanted non-index orders here
    const order: ListOrderType = (pagination?.order || []).filter((x) =>
      ['name', 'description'].includes(x[0]),
    );

    return this.flowerRepository.paginate(
      {
        ...pagination,
        order,
      },
      filters,
      options?.count,
    );
  }

  async flowerGet(
    id: string,
    data?: { relations: FlowerRelation[] },
  ): Promise<FlowerEntity> {
    return await this.flowerRepository.findOneOrFail(id, {
      relations: data?.relations,
    });
  }

  async flowerCreate(data: {
    name: string;
    description: string;
    genusId?: string;
    id?: string;
  }): Promise<FlowerEntity> {
    return await this.entityManger.transaction(async (entityManager) => {
      const flowerRepository =
        entityManager.getCustomRepository(FlowerRepository);

      if (!data.genusId) {
        throw new BadRequestException('A genus is required');
      }
      const flower = flowerRepository.create({
        id: data.id || makeUUID(),
        name: data.name,
        description: data.description,
        genusId: data.genusId,
      });

      try {
        await flowerRepository.insert(flower);
      } catch (e) {
        if (
          e instanceof ConstraintException &&
          e.constraint_name === 'fk_flower_genus_id_flower_genus_id'
        ) {
          throw new BadRequestException('Genus does not exist');
        }
        throw e;
      }
      return flower;
    });
  }

  async flowerUpdate(
    id: string,
    data: {
      name?: string;
      description?: string;
      genusId?: string;
      genus?: {
        name: string;
        description?: string;
      };
      version: number;
    },
  ): Promise<FlowerEntity> {
    return await this.entityManger.transaction(async (entityManager) => {
      const flowerRepository =
        entityManager.getCustomRepository(FlowerRepository);

      const flowerEntity = await flowerRepository.findOneOrFail({
        where: { id, version: data.version },
      });
      if (data.name !== undefined) {
        flowerEntity.name = data.name;
      }
      if (data.description !== undefined) {
        flowerEntity.description = data.description;
      }
      if (data.genusId) {
        if (data.genusId !== flowerEntity.genusId) {
          flowerEntity.genusId = data.genusId;
        }
      } else if (data.genus) {
        const genus = await this.genusCreate(
          data.genus,
          entityManager.getCustomRepository(FlowerGenusRepository),
        );
        flowerEntity.genusId = genus.id;
      }
      return await entityManager.save(flowerEntity);
    });
  }

  async flowerDelete(id: string, data?: { version?: number }): Promise<void> {
    await this.entityManger.transaction(async (entityManager) => {
      const flowerRepository =
        entityManager.getCustomRepository(FlowerRepository);
      const flowerEntity = await flowerRepository.findOneOrFail(
        data?.version ? { id, version: data.version } : { id },
      );
      await flowerRepository.remove(flowerEntity);
    });
  }
}
