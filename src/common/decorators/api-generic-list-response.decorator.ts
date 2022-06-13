import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { GenericList } from '~database/utils';

export interface ApiGenericListResponseOptions<TModel extends Type> {
  response: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator;
  model: TModel;
}

export const ApiGenericListResponse = <TModel extends Type>(
  options: ApiGenericListResponseOptions<TModel>,
): any => {
  const { model, response } = options;
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(GenericList),
    response({
      schema: {
        title: `GenericListResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(GenericList) },
          {
            properties: {
              [GenericList.ITEMS_PROPERTY]: {
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
