import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { FlowerEntity, FlowerGenusEntity } from '~database/entities';
import { FlowerGenusFixture, FlowerFixture } from '~database/fixtures';
import {
  FlowerGenusRepository,
  FlowerRepository,
} from '~database/repositories';
import { Fixtures } from '~database/utils/fixtures';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '~common/exceptions';
import { createTestingModule } from '~modules/app/app.utils';
import { makeId, makeUUID } from '~utils/uuid';

import { flowerConfigFactory } from './flower.config';
import { FlowerService } from './flower.service';

/**
 * Example of doing a database-connected test
 *  - using TypeormFixtures we can set up and clean up the data
 */
describe('flower.service', () => {
  let flowerService: FlowerService;
  let flowerGenus0: FlowerGenusEntity;
  let flower0: FlowerEntity;
  let connection: Connection;

  const instanceID = makeId();
  const fixtures = new Fixtures()
    .addFixture(FlowerGenusFixture, [{ name: `Flower Genus ${instanceID}` }])
    .addFixture(FlowerFixture, [
      // name will be matched with the genus
      {
        name: `Flower ${instanceID}`,
        genus: { name: `Flower Genus ${instanceID}` },
      },
    ]);

  beforeAll(async () => {
    const flowerModule = await createTestingModule(
      [
        TypeOrmModule.forFeature([FlowerRepository, FlowerGenusRepository]),
        ConfigModule.forFeature(flowerConfigFactory),
      ],
      [FlowerService],
    );
    flowerService = flowerModule.get<FlowerService>(FlowerService);
    connection = flowerModule.get<Connection>(Connection);

    await fixtures.load(connection);
    flowerGenus0 = fixtures.getEntity(FlowerGenusEntity, 0);
    flower0 = fixtures.getEntity(FlowerEntity, 0);
  });

  // drop fixtures when the test ends
  afterAll(fixtures.clean);

  test('genusPaginate', async () => {
    const list1 = await flowerService.genusPaginate(
      {
        order: [['name', 'DESC']],
        limit: 10,
        defaultOrder: [['createdAt', 'ASC']],
      },
      {
        name: flowerGenus0.name,
      },
      { count: true },
    );

    expect(list1.items.length).toEqual(1);

    const list2 = await flowerService.genusPaginate(
      {
        page: 1,
        limit: 200,
        defaultOrder: [['name', 'ASC']],
        maxLimit: 20,
      },
      {
        name: flowerGenus0.name,
        description: 'non-existing-description',
      },
      { count: true },
    );

    expect(list2.items.length).toEqual(0);
    expect(list2.limit).toEqual(20);
    expect(list2.order).toEqual([['name', 'ASC']]);
  });

  test('genusGet', async () => {
    const fetchedFlowerGenus0 = await flowerService.genusGet(flowerGenus0.id);
    expect(fetchedFlowerGenus0.name).toEqual(flowerGenus0.name);

    await expect(flowerService.genusGet(makeUUID())).rejects.toThrow(
      NotFoundException,
    );
  });

  test('genusCreate', async () => {
    await expect(
      flowerService.genusCreate({
        id: flowerGenus0.id,
        name: `Genus ${flowerGenus0.id}`,
        description: 'Genus 1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  test('genusUpdate', async () => {
    const name = `${flowerGenus0.name} New`;
    // test version protection
    await expect(
      flowerService.genusUpdate(flowerGenus0.id, {
        name,
        version: flowerGenus0.version - 1,
      }),
    ).rejects.toThrow(NotFoundException);

    const newFlowerGenus = await flowerService.genusUpdate(flowerGenus0.id, {
      name,
      version: flowerGenus0.version,
    });

    expect(newFlowerGenus.version).toEqual(flowerGenus0.version + 1);
    expect(newFlowerGenus.name).toEqual(name);
  });

  test('genusDelete', async () => {
    // try to delete a entity with related items
    await expect(flowerService.genusDelete(flowerGenus0.id)).rejects.toThrow(
      ConflictException,
    );

    // try to delete a non-existing entity
    await expect(
      flowerService.genusDelete(makeUUID(), { version: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  test('flowerPaginate', async () => {
    const list1 = await flowerService.flowerPaginate(
      {
        order: [['name', 'DESC']],
        limit: 10,
        defaultOrder: [['createdAt', 'ASC']],
      },
      {
        name: flower0.name,
      },
      { count: true },
    );

    expect(list1.items.length).toEqual(1);

    const list2 = await flowerService.flowerPaginate(
      {
        page: 1,
        limit: 200,
        defaultOrder: [['name', 'ASC']],
        maxLimit: 20,
      },
      {
        name: flower0.name,
        description: 'non-existing-description',
      },
      { count: true },
    );

    expect(list2.items.length).toEqual(0);
    expect(list2.limit).toEqual(20);
    expect(list2.order).toEqual([['name', 'ASC']]);
  });

  test('flowerGet', async () => {
    const fetchedFlower0 = await flowerService.flowerGet(flower0.id, {
      relations: ['genus'],
    });
    expect(fetchedFlower0.name).toEqual(flower0.name);

    await expect(flowerService.flowerGet(makeUUID())).rejects.toThrow(
      NotFoundException,
    );
  });

  test('flowerCreate', async () => {
    await expect(
      flowerService.flowerCreate({
        id: flower0.id,
        name: `Flower ${flower0.id}`,
        description: 'Flower 1',
        genusId: flowerGenus0.id,
      }),
    ).rejects.toThrow(ConflictException);

    const newFlowerId = makeUUID();
    const newFlower = await flowerService.flowerCreate({
      id: newFlowerId,
      name: `Flower ${flower0.id}`,
      description: 'Flower 1',
      genusId: flowerGenus0.id,
    });
    // always clean up the tests
    await flowerService.flowerDelete(newFlowerId, {
      version: newFlower.version,
    });

    await expect(
      flowerService.flowerDelete(makeUUID(), { version: 0 }),
    ).rejects.toThrow(NotFoundException);

    await expect(
      flowerService.flowerDelete(newFlowerId, { version: newFlower.version }),
    ).rejects.toThrow(NotFoundException);
  });

  test('flowerUpdate', async () => {
    const name = `${flower0.name} New`;
    await expect(
      flowerService.flowerUpdate(flower0.id, {
        name,
        version: flower0.version - 1,
      }),
    ).rejects.toThrow(NotFoundException);

    const newFlower = await flowerService.flowerUpdate(flower0.id, {
      name,
      version: flower0.version,
    });

    expect(newFlower.version).toEqual(flower0.version + 1);
    expect(newFlower.name).toEqual(name);
  });
});
