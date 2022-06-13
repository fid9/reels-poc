import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  FlowerGenusRepository,
  FlowerRepository,
} from '~database/repositories';

import { FlowerGenusController } from './flower-genus.controller';
import { flowerConfigFactory } from './flower.config';
import { FlowerController } from './flower.controller';
import { FlowerService } from './flower.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowerRepository, FlowerGenusRepository]),
    ConfigModule.forFeature(flowerConfigFactory),
  ],
  controllers: [FlowerGenusController, FlowerController],
  providers: [FlowerService],
  exports: [FlowerService],
})
export class FlowerModule {}
