import { EntityRepository } from 'typeorm';

import { UserEntity } from '~database/entities/user.entity';
import { paginateQueryBuilder } from '~database/utils/list.helper';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';

@EntityRepository(UserEntity)
export class UserRepository extends PostgresBaseRepository<UserEntity> {
  public async fetchList(
    pagination: PaginationOptionsInterface,
  ): Promise<PaginatedListInterface<UserEntity>> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.auction', 'auction')
      .innerJoinAndSelect('user.reels', 'reels')
      .where(`user.type = :issuerType`, { issuerType: 'ISSUER' })
      .orderBy({
        'user.displayName': 'ASC',
        'reels.createdAt': 'DESC',
      });

    return paginateQueryBuilder(query, pagination);
  }

  public async createUser(body: {
    type: string;
    username: string;
    displayName: string;
  }): Promise<UserEntity> {
    const userEntity = new UserEntity();
    userEntity.type = body.type;
    userEntity.isVerified = true;
    userEntity.displayName = body.displayName;
    userEntity.username = body.username;

    return this.save(userEntity);
  }
}
