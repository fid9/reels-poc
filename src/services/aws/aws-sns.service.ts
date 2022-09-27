import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';

@Injectable()
export class AwsSNSService {
  private _snsClient = new SNS({ region: 'us-east-1' });

  public async confirmSubscription(
    token: string,
    topicArn: string,
  ): Promise<void> {
    const params = {
      Token: token /* required */,
      TopicArn: topicArn /* required */,
    };
    await this._snsClient.confirmSubscription(params).promise();
  }
}
