import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReelRepository } from '~database/repositories/reel.repository';
import { UserRepository } from '~database/repositories/user.repository';

import { AwsModule } from '~services/aws/aws.module';

import { ReelController } from './reel.controller';
import { ReelService } from './reel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReelRepository, UserRepository]),
    AwsModule,
  ],
  controllers: [ReelController],
  providers: [ReelService],
})
export class ReelModule {}
