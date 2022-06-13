import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginatedList } from '~database/utils';

export interface ApiPaginatedListResponseOptions<TModel extends Type> {
  response: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator;
  model: TModel;
}

export const ApiPaginatedListResponse = <TModel extends Type>(
  options: ApiPaginatedListResponseOptions<TModel>,
): any => {
  const { model, response } = options;
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(PaginatedList),
    response({
      schema: {
        title: `PaginatedListResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedList) },
          {
            properties: {
              [PaginatedList.ITEMS_PROPERTY]: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
