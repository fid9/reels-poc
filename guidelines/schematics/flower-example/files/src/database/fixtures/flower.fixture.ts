import { DeepPartial } from 'typeorm';

import { FlowerEntity, FlowerGenusEntity } from '~database/entities';
import { FlowerRepository } from '~database/repositories';
import { Fixture, Fixtures } from '~database/utils/fixtures';

import { makeUUID } from '~utils/uuid';

export class FlowerFixture extends Fixture<FlowerEntity> {
  constructor(fixtures: Fixtures, data: DeepPartial<FlowerEntity>) {
    const id = makeUUID();
    super(
      fixtures,
      FlowerEntity,
      {
        id,
        name: `Flower ${id}`,
        description: `Flower ${id}`,
        version: 0,
        createdDate: new Date(),
        ...data,
        genus: fixtures.one(
          FlowerGenusEntity,
          data.genus as DeepPartial<FlowerGenusEntity>,
        ),
      },
      FlowerRepository,
    );
  }
}
