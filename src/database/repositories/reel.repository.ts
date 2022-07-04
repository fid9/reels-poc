import { InternalServerErrorException } from '@nestjs/common';
import { DeleteResult, EntityRepository, getRepository } from 'typeorm';

import { ReelLikeEntity } from '~database/entities/reel-like.entity';
import { ReelEntity } from '~database/entities/reel.entity';
import { paginateQueryBuilder } from '~database/utils/list.helper';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

import { NotFoundException } from '~common/exceptions';
import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';
import { ReelStatus } from '~modules/reel/enums/reel-status.enum';

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

  public async fetchListByIssuerId(
    issuerId: string,
    pagination: PaginationOptionsInterface,
  ): Promise<PaginatedListInterface<ReelEntity>> {
    const query = this.createQueryBuilder('reel')
      .innerJoin('reel.user', 'user')
      .where(`user.type = :issuerType`, { issuerType: 'ISSUER' })
      .andWhere(`user.id = :issuerId`, { issuerId })
      .orderBy({
        'reel.createdAt': 'DESC',
      });

    return paginateQueryBuilder(query, pagination);
  }

  public async updateReel(
    reel: ReelEntity,
    data: {
      isVisible?: boolean;
      status?: string;
    },
  ): Promise<void> {
    if (data.status) {
      reel.status = data.status as ReelStatus;

      if (data.status === ReelStatus.UPLOAD_ERROR) {
        // TODO: log or something
      }
    }

    if (data.isVisible !== undefined) {
      reel.isVisible = data.isVisible;
    }

    await this.save(reel);
  }

  public async createReel(body: {
    jobId: string;
    objectId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    const reelEntity = new ReelEntity();
    reelEntity.objectId = body.objectId;
    reelEntity.issuerId = body.issuerId;
    reelEntity.jobId = body.jobId;

    try {
      return await this.save(reelEntity);
    } catch (e) {
      throw new InternalServerErrorException('Internal error on DB');
    }
  }

  public async deleteReel(objectId: string): Promise<DeleteResult> {
    const reelEntity = await this.findOne({ objectId });

    if (!reelEntity) {
      throw new NotFoundException();
    }

    return this.delete(reelEntity.id);
  }

  private async createLike(body: {
    reelId: string;
    userId: string;
  }): Promise<void> {
    const queryBuilder =
      getRepository<ReelLikeEntity>('reel-like').createQueryBuilder(
        'reel-like',
      );

    const reelLikeEntity = new ReelLikeEntity();

    await queryBuilder
      .insert()
      .into(ReelLikeEntity)
      .values([
        {
          ...reelLikeEntity,
          ...body,
        },
      ])
      .execute();
  }

  private async deleteLike(reelId: string, userId: string): Promise<void> {
    const queryBuilder =
      getRepository<ReelLikeEntity>('reel-like').createQueryBuilder(
        'reel-like',
      );

    await queryBuilder
      .delete()
      .where(`"reel-like".reel_id = :reelId`, { reelId })
      .andWhere(`"reel-like".user_id = :userId`, { userId })
      .execute();
  }

  private async incrementLikeCount(reelId: string): Promise<void> {
    await this.createQueryBuilder('reel')
      .update(ReelEntity)
      .set({ likeCount: () => 'likeCount + 1' })
      .where('reel.id = :reelId', {
        reelId,
      })
      .execute();
  }

  private async decrementLikeCount(reelId: string): Promise<void> {
    await this.createQueryBuilder('reel')
      .update(ReelEntity)
      .set({ likeCount: () => 'likeCount - 1' })
      .where('reel.id = :reelId', {
        reelId,
      })
      .execute();
  }

  public async unlikeReel(reelId: string, userId: string): Promise<void> {
    const reelEntity = await this.findOne(reelId);

    if (!reelEntity) {
      throw new NotFoundException();
    }

    await this.deleteLike(reelEntity?.id, userId);
    await this.decrementLikeCount(reelEntity.id);
  }

  public async likeReel(data: {
    reelId: string;
    userId: string;
  }): Promise<void> {
    const reelEntity = await this.findOne(data.reelId);

    if (!reelEntity) {
      throw new NotFoundException();
    }

    await this.createLike(data);
    await this.incrementLikeCount(data.reelId);
  }
}
