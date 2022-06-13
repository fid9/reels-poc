import { SelectQueryBuilder } from 'typeorm';

import { ListOrderType } from '~common/handlers/interfaces/list.interfaces';

export function orderQuery<T>(
  query: SelectQueryBuilder<T>,
  order: ListOrderType,
): SelectQueryBuilder<T> {
  let q = query;

  if (!Array.isArray(order)) {
    throw 'Expected array';
  }

  for (const o of order) {
    q = q.addOrderBy(o[0], o[1]);
  }

  return q;
}
