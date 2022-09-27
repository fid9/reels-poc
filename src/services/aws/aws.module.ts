import { Global, Module } from '@nestjs/common';

import { AwsMediaConvertService } from './aws-mediaConvert.service';
import { AwsS3Service } from './aws-s3.service';
import { AwsSNSService } from './aws-sns.service';

@Global()
@Module({
  providers: [AwsS3Service, AwsMediaConvertService, AwsSNSService],
  exports: [AwsS3Service, AwsMediaConvertService, AwsSNSService],
})
export class AwsModule {}
