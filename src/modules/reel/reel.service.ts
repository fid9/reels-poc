import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReelEntity } from '~database/entities/reel.entity';
import { ReelRepository } from '~database/repositories/reel.repository';

import { NotFoundException } from '~common/exceptions';
import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';
import { AppConfig, APP_CONFIG } from '~modules/app/app.config';
import { AwsS3Service } from '~services/aws/aws-s3.service';

interface ReelFilters {
  name?: string;
  description?: string;
}

@Injectable()
export class ReelService {
  constructor(
    private awsS3Service: AwsS3Service,
    @InjectRepository(ReelRepository)
    private reelRepository: ReelRepository,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
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

  async likeReel(body: { reelId: string; userId: string }): Promise<void> {
    return this.reelRepository.likeReel(body);
  }

  async createReel(body: {
    reelId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    return this.reelRepository.createReel(body);
  }

  async unlikeReel(reelId: string, userId: string): Promise<void> {
    return this.reelRepository.unlikeReel(reelId, userId);
  }

  async deleteReel(reelId: string): Promise<void> {
    const fileExists = await this.awsS3Service.fileExists(
      this.appConfig.s3.bucketName,
      reelId,
    );

    if (!fileExists) {
      throw new NotFoundException();
    }

    await this.reelRepository.deleteReel(reelId);
    await this.awsS3Service.deleteFile(this.appConfig.s3.bucketName, reelId);
  }
}
