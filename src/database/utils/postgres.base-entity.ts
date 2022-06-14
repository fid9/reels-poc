import {
  BaseEntity as TypeOrmBaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

abstract class BaseEntity extends TypeOrmBaseEntity {}

export abstract class DatabaseIdOnlyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class DatabaseEntity extends DatabaseIdOnlyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
