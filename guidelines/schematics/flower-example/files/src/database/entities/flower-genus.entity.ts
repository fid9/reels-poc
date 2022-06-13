import { Entity, OneToMany, Column } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { FlowerEntity } from './flower.entity';

@Entity()
export class FlowerGenusEntity extends DatabaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => FlowerEntity, (f: FlowerEntity) => f.genus)
  flowers?: FlowerEntity[];
}
