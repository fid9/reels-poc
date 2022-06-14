import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '~database/entities/user.entity';
import { UserRepository } from '~database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(body: { type: string }): Promise<UserEntity> {
    return this.userRepository.createUser(body);
  }
}
