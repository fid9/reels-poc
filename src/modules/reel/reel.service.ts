import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReelEntity } from '~database/entities/reel.entity';
import { UserEntity } from '~database/entities/user.entity';
import { ReelRepository } from '~database/repositories/reel.repository';
import { UserRepository } from '~database/repositories/user.repository';

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
import { AwsSNSService } from '~services/aws/aws-sns.service';

import { ReelStatus } from './enums/reel-status.enum';

@Injectable()
export class ReelService {
  constructor(
    private awsS3Service: AwsS3Service,
    private awsSnsService: AwsSNSService,
    private awsMediaConvertService: AwsMediaConvertService,
    @InjectRepository(ReelRepository)
    private reelRepository: ReelRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
  ) {}

  public async confirmSnsSubscription(
    token: string,
    topicArn: string,
  ): Promise<void> {
    await this.awsSnsService.confirmSubscription(token, topicArn);
  }

  public async getList(
    pagination: PaginationOptionsInterface,
  ): Promise<PaginatedListInterface<UserEntity>> {
    return this.userRepository.fetchList(pagination);
  }

  public async getIssuerList(
    issuerId: string,
    pagination: PaginationOptionsInterface,
  ): Promise<PaginatedListInterface<ReelEntity>> {
    return this.reelRepository.fetchListByIssuerId(issuerId, pagination);
  }

  async likeReel(body: { reelId: string; userId: string }): Promise<void> {
    return this.reelRepository.likeReel(body);
  }

  async updateReelUploadStatus(
    jobId: string,
    data: {
      status: string;
    },
  ): Promise<void> {
    const reel = await this.reelRepository.findOne({ jobId });

    if (!reel) {
      return;
    }

    const status =
      data.status === 'COMPLETE'
        ? ReelStatus.SUBMITTED
        : ReelStatus.UPLOAD_ERROR;

    await this.reelRepository.updateReel(reel, {
      status,
    });

    // send FCM notification to client
  }

  async createReel(data: {
    objectId: string;
    issuerId: string;
  }): Promise<ReelEntity> {
    const metadata = await this.awsS3Service.getObjectMetadata({
      key: data.objectId,
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
      objectId: data.objectId,
    });

    if (existingReel) {
      throw new ForbiddenException('Reel already uploaded!');
    }

    const response = await this.awsMediaConvertService.createJob(data.objectId);

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
