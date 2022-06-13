import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { TypeORMLogger } from '~database/utils/logger';
import { SnakeCaseNamingStrategy } from '~database/utils/snake-naming.strategy';

export function typeOrmSettings(
  options: TypeOrmModuleOptions,
): TypeOrmModuleOptions {
  const src = path.join(__dirname, '..', '..');
  return {
    maxQueryExecutionTime: 1000, // log long queries
    ...options,
    synchronize: false, // never use synchronize
    logger: new TypeORMLogger(options.logging || 'all'),
    entities: [path.join(src, 'database', 'entities', '*.entity{.ts,.js}')],
    migrations: [path.join(src, 'database', 'migrations', '*{.ts,.js}')],
    namingStrategy: new SnakeCaseNamingStrategy(),
  };
}
