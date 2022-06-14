import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { BadRequestException } from '~common/exceptions';

@Injectable()
export class AwsS3Service {
  private _s3Client = new S3();

  // async findAll(bucketName: string) {
  //   return this._s3Client
  //     .listObjects({
  //       Bucket: bucketName,
  //     })
  //     .promise();
  // }

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

  //   async saveFile(
  //     bucketName: string,
  //     key: string,
  //     fileContent: Buffer | string,
  //     ContentType: string,
  //     ContentDisposition: string,
  //   ): Promise<void> {
  //     if (
  //       !bucketName ||
  //       !key ||
  //       !fileContent ||
  //       !ContentType ||
  //       !ContentDisposition
  //     ) {
  //       throw new BadRequestException('Bad request');
  //     }

  //     try {
  //       await this._s3Client
  //         .upload({
  //           Bucket: bucketName,
  //           Key: key,
  //           Body: fileContent,
  //           ContentType,
  //           ContentDisposition,
  //         })
  //         .promise();
  //     } catch (e) {
  //       throw e;
  //     }
  //   }

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
