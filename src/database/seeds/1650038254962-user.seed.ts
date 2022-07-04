import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { UserEntity } from '../entities/user.entity';
import { staticUserSeeds } from './data/user.seed-data';

export default class UserSeeds implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(staticUserSeeds)
      .execute();
  }
}
