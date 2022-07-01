import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { BadRequestException } from '~common/exceptions';

import { S3ReelCustomMetadata } from './s3-reel-custom-metadata.interface';

@Injectable()
export class AwsS3Service {
  private _s3Client = new S3();

  async getFile(
    bucketName: string,
    key: string,
  ): Promise<S3.Types.GetObjectOutput> {
    if (!bucketName || !key) {
      throw new BadRequestException('Bad request');
    }

    try {
      return this._s3Client
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
    } catch (e) {
      throw e;
    }
  }

  async fileExists(bucketName: string, key: string): Promise<boolean> {
    if (!bucketName || !key) {
      throw new BadRequestException();
    }

    try {
      await this._s3Client
        .headObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
      return true;
    } catch (e) {
      return false;
    }
  }

  async getObjectMetadata(data: {
    key: string;
    bucketName: string;
  }): Promise<S3ReelCustomMetadata | undefined> {
    try {
      const { key } = data;

      const response = await this._s3Client
        .headObject({
          Bucket: data.bucketName,
          Key: key,
        })
        .promise();

      if (response.$response.error) {
        return undefined;
      }

      return response.Metadata;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async deleteFile(bucketName: string, key: string): Promise<void> {
    if (!bucketName || !key) {
      throw new BadRequestException('Bad request');
    }

    try {
      await this._s3Client
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
    } catch (e) {
      // TODO: make internal errors
      throw e;
    }
  }
}
