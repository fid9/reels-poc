import { SelectQueryBuilder } from 'typeorm';

import { orderQuery } from '~database/utils/order.helper';

import {
  PaginatedListInterface,
  PaginationOptionsInterface,
} from '~common/handlers/interfaces/list.interfaces';

/**
 * @param queryBuilder
 * @param pagination
 * @param count - return a total (for a speed penalty)
 */
export async function paginateQueryBuilder<EntityType>(
  queryBuilder: SelectQueryBuilder<EntityType>,
  pagination: PaginationOptionsInterface,
  count = false,
): Promise<PaginatedListInterface<EntityType>> {
  const { page, limit } = normalizePagination(pagination);

  let q = queryBuilder;

  const order =
    pagination.order && pagination.order.length > 0
      ? pagination.order
      : pagination.defaultOrder && pagination.defaultOrder.length > 0
      ? pagination.defaultOrder
      : [];

  if (order.length > 0) {
    q = orderQuery(q, order);
  }

  if (count) {
    const [items, total] = await q
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      order,
      page,
      limit,
      items,
      total: total,
    };
  } else {
    const items = await q
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    return {
      order,
      page,
      limit,
      items,
      total: undefined,
    };
  }
}

function normalizePagination(pagination: PaginationOptionsInterface): {
  page: number;
  limit: number;
} {
  const maxLimit = pagination.maxLimit || 50;
  // let the limit be up to maxLimit or 20 if not set
  const limit =
    (pagination.limit === undefined ? 20 : pagination.limit) > maxLimit
      ? maxLimit
      : pagination.limit || 20;
  // pages start at 1
  const page =
    (pagination.page === undefined ? 1 : pagination.page) < 1
      ? 1
      : pagination.page || 1;

  return {
    page,
    limit,
  };
}
