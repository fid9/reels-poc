import { EntityRepository } from 'typeorm';

import { UserEntity } from '~database/entities/user.entity';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

@EntityRepository(UserEntity)
export class UserRepository extends PostgresBaseRepository<UserEntity> {
  public async createUser(body: { type: string }): Promise<UserEntity> {
    const userEntity = new UserEntity();
    userEntity.type = body.type;

    return this.save(userEntity);
  }
}
