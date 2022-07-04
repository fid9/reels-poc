import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuctionRepository } from '~database/repositories/auction.repository';
import { UserRepository } from '~database/repositories/user.repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, AuctionRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
