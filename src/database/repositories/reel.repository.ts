import { InternalServerErrorException } from '@nestjs/common';
import { DeleteResult, EntityRepository, getRepository } from 'typeorm';

import { ReelLikeCountEntity } from '~database/entities/reel-like-count.entity';
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
import { ReelUploadStatus } from '~modules/reel/enums/reel-upload-status.enum';

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

  public async updateReel(
    reel: ReelEntity,
    data: {
      uploadStatus: string;
      isVisible?: boolean;
      status?: ReelStatus;
    },
  ): Promise<void> {
    if (data.uploadStatus) {
      reel.uploadStatus = data.uploadStatus as ReelUploadStatus;

      if (data.uploadStatus === ReelUploadStatus.ERROR) {
        // TODO: log or something
      }
    }

    if (data.isVisible !== undefined) {
      reel.isVisible = data.isVisible;
    }

    if (data.status) {
      reel.status = data.status;
    }

    await this.save(reel);
  }

  public async createReel(body: {
    jobId: string;
    reelId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    const reelEntity = new ReelEntity();
    reelEntity.reelId = body.reelId;
    reelEntity.issuerId = body.issuerId;
    reelEntity.jobId = body.jobId;

    try {
      return await this.save(reelEntity);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Internal error on DB');
    }
  }

  public async deleteReel(reelId: string): Promise<DeleteResult> {
    const reelEntity = await this.findOne({ reelId });

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
    const queryBuilder =
      getRepository<ReelLikeCountEntity>('reel-like-count').createQueryBuilder(
        'reel-like-count',
      );

    const likeCount = await queryBuilder
      .where(`"reel-like-count".reel_id = :reelId`, { reelId })
      .getOne();

    if (!likeCount) {
      const likeCountEntity = new ReelLikeCountEntity();
      await queryBuilder
        .insert()
        .into(ReelLikeCountEntity)
        .values([
          {
            ...likeCountEntity,
            reelId,
            count: 1,
          },
        ])
        .execute();

      return;
    }

    await queryBuilder
      .update(ReelLikeCountEntity)
      .set({ count: () => 'count + 1' })
      .where(`"reel-like-count".reel_id = :reelId`, { reelId })
      .execute();
  }

  private async decrementLikeCount(reelId: string): Promise<void> {
    const queryBuilder =
      getRepository<ReelLikeCountEntity>('reel-like-count').createQueryBuilder(
        'reel-like-count',
      );

    await queryBuilder
      .update(ReelLikeCountEntity)
      .set({ count: () => 'count - 1' })
      .where(`"reel-like-count".reel_id = :reelId`, { reelId })
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

  public async likeReel(body: {
    reelId: string;
    userId: string;
  }): Promise<void> {
    const reelEntity = await this.findOne(body.reelId);

    if (!reelEntity) {
      throw new NotFoundException();
    }

    await this.createLike(body);
    await this.incrementLikeCount(body.reelId);
  }
}
