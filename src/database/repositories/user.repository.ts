import { EntityRepository } from 'typeorm';

import { UserEntity } from '~database/entities/user.entity';
import { PostgresBaseRepository } from '~database/utils/postgres.base-repository';

@EntityRepository(UserEntity)
export class UserRepository extends PostgresBaseRepository<UserEntity> {
  public async createUser(body: {
    type: string;
    isVerified: boolean;
    username: string;
    displayName: string;
  }): Promise<UserEntity> {
    const userEntity = new UserEntity();
    userEntity.type = body.type;
    userEntity.isVerified = body.isVerified;
    userEntity.displayName = body.displayName;
    userEntity.username = body.username;

    return this.save(userEntity);
  }
}
