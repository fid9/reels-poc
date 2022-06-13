import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { ConnectionOptionsReader } from 'typeorm';

import { typeOrmSettings } from './typeorm.helper';

/**
 * TypeOrm Configuration
 *  - @see https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
 *  - on production all values need to be set in ENVIRONMENT variables
 *  - you can load ENVIRONMENT variables using ECS secrets or the SSM helper
 *  - within development, we can use ormconfig.* so that typeorm cli works
 *  - multiple connections need multiple .config.ts files
 *     https://docs.nestjs.com/techniques/database#multiple-databases
 */
export const typeOrmConfigFactory = registerAs(
  'typeorm',
  async (): Promise<TypeOrmModuleOptions> => {
    // replicate native typeorm behavior:
    //  If TYPEORM_CONNECTION exists, ignore the config file
    process.env.TYPEORM_CONFIG_FACTORY = 'true';
    const options = await new ConnectionOptionsReader({
      root: path.join(__dirname, '..', '..', '..'),
    }).get('default');

    return typeOrmSettings(options);
  },
);

export const TYPEORM_CONFIG = typeOrmConfigFactory.KEY;
