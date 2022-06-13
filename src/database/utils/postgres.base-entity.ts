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
  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
