import { intersectionWith, isMatch } from 'lodash';
import { Connection, DeepPartial, ObjectType, Repository, In } from 'typeorm';

import { NotFoundException } from '~common/exceptions';

export class Fixture<EntityType> {
  public fixtures: Fixtures;
  public entity: EntityType;
  public entityClass: ObjectType<EntityType>;
  public repositoryClass: new () => Repository<EntityType>;
  public fixture: DeepPartial<EntityType>;

  public constructor(
    fixtures: Fixtures,
    entityClass: ObjectType<EntityType>,
    fixture: DeepPartial<EntityType>,
    repositoryClass: new () => Repository<EntityType>,
  ) {
    this.fixtures = fixtures;
    this.entityClass = entityClass;
    this.repositoryClass = repositoryClass;
    this.fixture = fixture;
  }
}

type FixtureConstructor<
  EntityType,
  FixtureType extends Fixture<EntityType>,
> = new (fixtures: Fixtures, fixture: DeepPartial<EntityType>) => FixtureType;

/* eslint-disable @typescript-eslint/no-explicit-any */

export class Fixtures {
  public fixtures: Fixture<any>[] = [];
  public entities: any[];
  public connection: Connection;

  /**
   * Add fixtures to database
   *  - todo, use @bind instead of arrow function method
   */
  public load = async (connection?: Connection): Promise<any[]> => {
    if (connection) this.connection = connection;
    const entities: any[] = [];

    for (const fixture of this.fixtures) {
      const entityRepository = fixture.repositoryClass
        ? this.connection.getCustomRepository(fixture.repositoryClass)
        : this.connection.getRepository(fixture.entityClass);
      fixture.entity = entityRepository.create(fixture.fixture);
      entities.push(fixture.entity);
    }

    await this.connection.transaction(async (manager) => {
      return await manager.save(entities);
    });

    this.entities = entities;

    return this.entities;
  };

  /**
   * Remove created fixtures from database
   *  - todo, use @bind instead of arrow function method
   */
  public clean = async (): Promise<void> => {
    const fixtures = this.fixtures.reverse();
    for (const repositoryClass of [
      ...new Set(fixtures.map((x) => x.repositoryClass)),
    ]) {
      await this.connection.getCustomRepository(repositoryClass).delete({
        id: In(
          fixtures
            .filter((x) => x.repositoryClass === repositoryClass)
            .map((x) => x.entity.id),
        ),
      });
    }
    // close the connection
    await this.connection.close();
  };

  public one<EntityType>(
    relationType: ObjectType<EntityType>,
    relation: Partial<EntityType> | DeepPartial<EntityType>,
  ): EntityType | undefined {
    if (!relation) {
      throw new Error(`Relation data is required`);
    }
    const fixture: Fixture<EntityType> | undefined = this.fixtures.find(
      (f) =>
        f.entityClass === relationType &&
        isMatch(f.fixture, relation as Record<string, unknown>),
    );
    if (!fixture) {
      return undefined;
    }
    return fixture.fixture as EntityType;
  }

  public many<EntityType>(
    relationType: ObjectType<EntityType>,
    relations: Partial<EntityType>[] | DeepPartial<EntityType>[],
  ): EntityType[] {
    if (!relations) {
      throw new Error(`Relation data is required`);
    }
    return intersectionWith(
      this.fixtures
        .filter((f) => f.entityClass === relationType)
        .map((f) => f.fixture),
      relations,
      isMatch,
    ) as unknown as EntityType[];
  }

  public getEntity<EntityType>(
    relationType: ObjectType<EntityType>,
    relationOrIndex: Partial<EntityType> | number,
  ): EntityType {
    if (relationOrIndex === undefined) {
      throw new Error(`Relation data is required`);
    }
    const fixtures: Fixture<EntityType>[] = this.fixtures.filter(
      (f) => f.entityClass === relationType,
    );
    if (typeof relationOrIndex === 'number') {
      if (fixtures.length < relationOrIndex) {
        throw new Error(`Index out of bounds`);
      }
      return fixtures[relationOrIndex].entity;
    }
    const fixture: Fixture<EntityType> | undefined = fixtures.find((f) =>
      isMatch(f.fixture as Record<string, unknown>, relationOrIndex),
    );
    if (!fixture) {
      throw new NotFoundException();
    }
    return fixture.entity;
  }

  public addFixture<EntityType, FixtureType extends Fixture<EntityType>>(
    fixtureType: FixtureConstructor<EntityType, FixtureType>,
    items: DeepPartial<EntityType>[],
  ): Fixtures {
    for (const item of items) {
      this.fixtures.push(new fixtureType(this, item));
    }
    return this;
  }
}
