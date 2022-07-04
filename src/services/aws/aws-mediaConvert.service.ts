import { Inject, Injectable } from '@nestjs/common';
import { MediaConvert } from 'aws-sdk';

import { InternalServerException } from '~common/exceptions';
import { AppConfig, APP_CONFIG } from '~modules/app/app.config';

import { MediaConvertAwsHelper } from './media-convert.aws.helper';

@Injectable()
export class AwsMediaConvertService {
  constructor(@Inject(APP_CONFIG) private readonly appConfig: AppConfig) {}
  private _mediaConvertClient = new MediaConvert({
    region: 'us-east-1',
    endpoint: 'https://vasjpylpa.mediaconvert.us-east-1.amazonaws.com',
  });

  public async createJob(
    reelId: string,
  ): Promise<MediaConvert.CreateJobResponse> {
    const params = MediaConvertAwsHelper.generateCreateJobParams(
      this.appConfig.mediaConvert,
      reelId,
    );

    try {
      const job = await this._mediaConvertClient.createJob(params).promise();
      return job;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      throw new InternalServerException('Internal error occurred!');
    }
  }
}
