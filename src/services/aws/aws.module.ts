import { Global, Module } from '@nestjs/common';

import { AwsMediaConvertService } from './aws-mediaConvert.service';
import { AwsS3Service } from './aws-s3.service';

@Global()
@Module({
  providers: [AwsS3Service, AwsMediaConvertService],
  exports: [AwsS3Service, AwsMediaConvertService],
})
export class AwsModule {}
