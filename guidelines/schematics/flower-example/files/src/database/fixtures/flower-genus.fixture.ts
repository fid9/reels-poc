import { DeepPartial } from 'typeorm';

import { FlowerGenusEntity } from '~database/entities';
import { FlowerGenusRepository } from '~database/repositories';
import { Fixture, Fixtures } from '~database/utils/fixtures';

import { makeUUID } from '~utils/uuid';

export class FlowerGenusFixture extends Fixture<FlowerGenusEntity> {
  constructor(fixtures: Fixtures, data: DeepPartial<FlowerGenusEntity>) {
    const id = makeUUID();
    super(
      fixtures,
      FlowerGenusEntity,
      {
        id,
        name: `Genus ${id}`,
        description: `Genus ${id}`,
        ...data,
      },
      FlowerGenusRepository,
    );
  }
}
