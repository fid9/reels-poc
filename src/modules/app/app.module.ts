import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import {
  typeOrmConfigFactory,
  TYPEORM_CONFIG,
} from '~modules/app/typeorm.config';
import { SentryModule } from '~services/sentry/sentry.module';

import { configModuleRootFactory } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // load the global config
    configModuleRootFactory(),
    // load sentry error reporting
    SentryModule,
    // load TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeOrmConfigFactory)],
      useFactory: (config: TypeOrmModuleOptions) => {
        return config;
      },
      inject: [TYPEORM_CONFIG],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
