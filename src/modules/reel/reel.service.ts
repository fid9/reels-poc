import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReelEntity } from '~database/entities/reel.entity';
import { ReelRepository } from '~database/repositories/reel.repository';

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '~common/exceptions';
import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';
import { AppConfig, APP_CONFIG } from '~modules/app/app.config';
import { AwsMediaConvertService } from '~services/aws/aws-mediaConvert.service';
import { AwsS3Service } from '~services/aws/aws-s3.service';

interface ReelFilters {
  name?: string;
  description?: string;
}

@Injectable()
export class ReelService {
  constructor(
    private awsS3Service: AwsS3Service,
    private awsMediaConvertService: AwsMediaConvertService,
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

  async updateReelUploadStatus(
    jobId: string,
    data: {
      uploadStatus: string;
    },
  ): Promise<void> {
    const reel = await this.reelRepository.findOne({ jobId });

    if (!reel) {
      return;
    }

    await this.reelRepository.updateReel(reel, {
      uploadStatus: data.uploadStatus,
    });

    // send FCM notification to client
  }

  async createReel(data: {
    reelId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    const metadata = await this.awsS3Service.getObjectMetadata({
      key: data.reelId,
      bucketName: this.appConfig.s3.bucketName,
    });

    if (!metadata) {
      throw new BadRequestException('Video failed to submit!');
    }

    const duration = Number(metadata.duration);

    if (isNaN(duration) || duration < 0 || duration > 30) {
      throw new ForbiddenException('Invalid or missing video duration!');
    }

    const existingReel = await this.reelRepository.findOne({
      reelId: data.reelId,
    });

    if (existingReel) {
      throw new ForbiddenException('Reel already uploaded!');
    }

    const response = await this.awsMediaConvertService.createJob(data.reelId);
    if (!response.Job) {
      throw new ForbiddenException('Job failed to transcode!');
    }

    return await this.reelRepository.createReel({
      jobId: response.Job.Id as string,
      ...data,
    });
  }

  async unlikeReel(paramId: string): Promise<void> {
    const reelId = paramId.substring(0, paramId.indexOf('_'));
    const userId = paramId.substring(paramId.indexOf('_') + 1, paramId.length);
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
