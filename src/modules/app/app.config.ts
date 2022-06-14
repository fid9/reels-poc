/**
 * Global Config
 */

import { DynamicModule } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { plainToClass, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import * as path from 'path';

import { Severity } from '~common/handlers/enums/severity.enum';
import { logEvent } from '~common/handlers/logging/logger.helper';
import { envToBoolean } from '~utils/config.util';
import { findDotEnv } from '~utils/env';
import version from '~version';

class CorsConfig {
  @IsOptional()
  @IsString()
  url?: string;

  @IsBoolean()
  all: boolean;
}

class LogConfig {
  @IsBoolean()
  requests: boolean;

  @IsBoolean()
  memoryUsage: boolean;
}

class SwaggerConfig {
  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  authUsername?: string;

  @IsOptional()
  @IsString()
  authPassword?: string;
}

class S3Config {
  @IsString()
  bucketName: string;
}

export class AppConfig {
  @IsString()
  environment: string;

  /**
   * git tag
   */
  @IsString()
  version: string;

  /**
   * hash of git commit
   */
  @IsString()
  release: string;

  /**
   * Isotime when the build was made
   */
  @IsString()
  buildTime: string;

  /**
   * Port on which to serve
   */
  @IsNumber()
  port: number;

  @ValidateNested()
  @Type(() => CorsConfig)
  cors: CorsConfig;

  @ValidateNested()
  @Type(() => SwaggerConfig)
  swagger: SwaggerConfig;

  @ValidateNested()
  @Type(() => LogConfig)
  log: LogConfig;

  @ValidateNested()
  @Type(() => S3Config)
  s3: S3Config;
}

export const appConfigFactory = registerAs('app', () => {
  const env = process.env;
  const apiVersion = env.VERSION ? env.VERSION : 'unknown';

  const config = plainToClass(AppConfig, {
    environment: env.STAGE,
    version: apiVersion,
    release: version.release,
    buildTime: version.buildTime,
    port: env.PORT ? parseInt(env.PORT, 10) : 3000,
    cors: {
      url: process.env.CORS_URL,
      all: envToBoolean(process.env.CORS_ALL),
    },
    swagger: {
      prefix: process.env.SWAGGER_PREFIX,
      authUsername: process.env.SWAGGER_AUTH_USERNAME,
      authPassword: process.env.SWAGGER_AUTH_PASSWORD,
    },
    log: {
      requests: envToBoolean(process.env.LOG_REQUESTS),
      memoryUsage: envToBoolean(process.env.LOG_MEMORY_USAGE),
    },
    s3: {
      bucketName: env.S3_BUCKET_NAME,
    },
  } as AppConfig);

  validateSync(config, { whitelist: true, forbidNonWhitelisted: true });

  return config;
});

export const APP_CONFIG = appConfigFactory.KEY;

/**
 * Configs are separated into .config.ts files
 *  but all base off the main ConfigModule that can choose
 *  the base file those configs load from
 */
export function configModuleRootFactory(): DynamicModule {
  const envFilePath = findDotEnv(path.resolve(__dirname, '..', '..', '..'));

  if (envFilePath) {
    logEvent(
      `[AppConfig] Using ENV ${envFilePath}`,
      {},
      { severity: Severity.Log },
    );
  }

  return ConfigModule.forRoot({
    load: [appConfigFactory],
    envFilePath,
    isGlobal: true,
  });
}
