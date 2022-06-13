import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';

import { DatabaseEntity } from '~database/utils/postgres.base-entity';

import { FlowerGenusEntity } from './flower-genus.entity';

export type FlowerRelation = 'genus';

@Entity()
export class FlowerEntity extends DatabaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'uuid' })
  genusId: string;

  @ManyToOne(
    () => FlowerGenusEntity,
    (genus: FlowerGenusEntity) => genus.flowers,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'genus_id', referencedColumnName: 'id' }])
  genus: FlowerGenusEntity;
}
