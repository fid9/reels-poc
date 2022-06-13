import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { RemoveOptions } from 'typeorm/repository/RemoveOptions';

import { ConflictException, NotFoundException } from '~common/exceptions';

export enum ConstraintType {
  UNIQUE_CONSTRAINT = 'UNIQUE_CONSTRAINT',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
}

export class ConstraintException extends ConflictException {
  public readonly constraint_name: string;
  public readonly constraint_type: ConstraintType;

  constructor(constraint_type: ConstraintType, constraint_name: string) {
    super();
    this.constraint_name = constraint_name;
    this.constraint_type = constraint_type;
  }
}

/**
 * Convert Errors into InternalExceptionAbstract
 */
export abstract class PostgresBaseRepository<
  Entity,
> extends Repository<Entity> {
  findOneOrFail(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;
  findOneOrFail(options?: FindOneOptions<Entity>): Promise<Entity>;
  findOneOrFail(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;
  async findOneOrFail(...args: any[]): Promise<Entity> {
    try {
      return await super.findOneOrFail(...args);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  async insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    try {
      return await super.insert(entity);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const uniqueConstraintMatch =
          /^duplicate key value violates unique constraint "([^"]+)"$/.exec(
            e.message,
          );
        if (uniqueConstraintMatch) {
          throw new ConstraintException(
            ConstraintType.UNIQUE_CONSTRAINT,
            uniqueConstraintMatch[0],
          );
        }
        const foreignKeyConstraint =
          /^insert or update on table "([^"]+)" violates foreign key constraint "([^"]+)"$/.exec(
            e.message,
          );
        if (foreignKeyConstraint) {
          throw new ConstraintException(
            ConstraintType.FOREIGN_KEY_CONSTRAINT,
            foreignKeyConstraint[2],
          );
        }
        // eslint-disable-next-line no-console
        console.log({ e });
      }
      throw e;
    }
  }

  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async remove(arg1: any, ...args: any[]): Promise<any> {
    try {
      return await super.remove(arg1, ...args);
    } catch (e) {
      const foreignKeyConstraintMatch =
        /^update or delete on table "([^"]+)" violates foreign key constraint "([^"]+)" on table "([^"]+)"$/.exec(
          e.message,
        );
      if (foreignKeyConstraintMatch) {
        throw new ConstraintException(
          ConstraintType.FOREIGN_KEY_CONSTRAINT,
          foreignKeyConstraintMatch[1],
        );
      }
      throw e;
    }
  }
}
