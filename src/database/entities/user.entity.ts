import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { UserDto } from '~modules/user/dto/user.dto';

@Entity('user')
export class UserEntity extends DatabaseEntity {
  @Column()
  type: string;

  public toUserDetailsDto(): UserDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      type: this.type,
    };
  }
}
