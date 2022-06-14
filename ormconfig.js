/**
 * TypeORM Configuration
 *  - typeorm.config will read this file if there is no TYPEORM_CONNECTION
 *  - typeorm:cli will use this file without typeorm.config
 * @version ormconfig@1.0
 */

const env = { ...require('./utils/env').parseDotEnv(), ...process.env };

const {
  SnakeCaseNamingStrategy,
} = require('~database/utils/snake-naming.strategy');

/**
 * @see https://orkhan.gitbook.io/typeorm/docs/using-ormconfig#using-environment-variables
 * @type TypeOrmModuleOptions
 */
let config = {
  type: env.TYPEORM_CONNECTION,
  host: env.TYPEORM_HOST,
  port: +env.TYPEORM_PORT,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  database: env.TYPEORM_DATABASE,
  maxQueryExecutionTime: env.TYPEORM_MAX_QUERY_EXECUTION_TIME,
  debug: env.TYPEORM_DEBUG ?? false,
  logging: env.TYPEORM_LOGGING ?? true,
  migrationsRun: env.TYPEORM_MIGRATIONS_RUN ?? false,
  synchronize: false, // never use synchronize
  namingStrategy: new SnakeCaseNamingStrategy(),
  entities: ['./src/database/entities/*.entity.ts'],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
  },
};

module.exports = config;
