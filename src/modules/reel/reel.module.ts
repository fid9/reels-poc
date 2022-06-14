import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReelRepository } from '~database/repositories/reel.repository';

import { ReelController } from './reel.controller';
import { ReelService } from './reel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReelRepository])],
  controllers: [ReelController],
  providers: [ReelService],
})
export class ReelModule {}
