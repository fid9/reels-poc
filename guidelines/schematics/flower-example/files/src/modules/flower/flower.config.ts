import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { validateFieldsSyncOrThrow } from '~utils/validation';

export class FlowerConfig {
  @IsString()
  @IsOptional()
  defaultGenus: string;
}

export const flowerConfigFactory = registerAs('flower', () => {
  const env = process.env;
  const config = plainToClass(FlowerConfig, {
    defaultGenus: env.FLOWER_DEFAULT_GENUS,
  } as FlowerConfig);

  validateFieldsSyncOrThrow(config, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  return config;
});

export const FLOWER_CONFIG = flowerConfigFactory.KEY;
