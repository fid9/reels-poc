import { Provider } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { configModuleRootFactory } from '~modules/app/app.config';
import {
  TYPEORM_CONFIG,
  typeOrmConfigFactory,
} from '~modules/app/typeorm.config';

export async function createTestingModule(
  imports: (Type | DynamicModule | Promise<DynamicModule> | ForwardReference)[],
  providers: (Type | Provider)[],
): Promise<TestingModule> {
  const mb = Test.createTestingModule({
    imports: [
      configModuleRootFactory(),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule.forFeature(typeOrmConfigFactory)],
        useFactory: (config: TypeOrmModuleOptions) => {
          return config;
        },
        inject: [TYPEORM_CONFIG],
      }),
      ...imports,
    ],
    providers: [...providers],
  });
  return await mb.compile();
}
