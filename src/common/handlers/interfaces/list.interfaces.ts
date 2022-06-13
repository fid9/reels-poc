export type ListOrderType = [name: string, direction: 'ASC' | 'DESC'][];

export type ListFilterType = Record<string, string | number | boolean>;

/**
 * Options Interface for lists (Controller -> Service)
 */
export interface GenericListOptionsInterface {
  // Batch size
  readonly limit?: number;

  // only allow rowsPerPage up to this number
  readonly maxLimit?: number;

  readonly order?: ListOrderType;

  // override the default order
  readonly defaultOrder?: ListOrderType;
}

/**
 * Interface for lists (Service -> Controller)
 */
export interface GenericListInterface<EntityType> {
  // items
  readonly items: EntityType[];

  // items per page
  readonly limit: number;

  // total items
  readonly total?: number;

  readonly order?: ListOrderType;
}

/**
 * Interface for Paginated list (Controller -> Service)
 */
export interface PaginationOptionsInterface
  extends GenericListOptionsInterface {
  // Result page (1-indexed)
  readonly page?: number;
}

/**
 * Interface for paginated lists (Service -> Controller)
 */
export interface PaginatedListInterface<EntityType>
  extends GenericListInterface<EntityType> {
  // Result page (1-indexed)
  readonly page: number;

  readonly filters?: ListFilterType;
}
