import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '~database/entities/user.entity';
import { AuctionRepository } from '~database/repositories/auction.repository';
import { UserRepository } from '~database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuctionRepository)
    private auctionRepository: AuctionRepository,
  ) {}

  async create(body: {
    type: string;
    username: string;
    displayName: string;
  }): Promise<UserEntity> {
    const user = await this.userRepository.createUser(body);

    await this.auctionRepository.createAuction({
      issuerId: user.id,
      isLive: false,
    });

    return user;
  }
}
