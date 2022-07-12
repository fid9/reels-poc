import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { JsonBodyMiddleware } from '~middlewares/json-body.middleware';
import { RawBodyMiddleware } from '~middlewares/raw-body.middleware';
import {
  typeOrmConfigFactory,
  TYPEORM_CONFIG,
} from '~modules/app/typeorm.config';
import { AuctionModule } from '~modules/auction/auction.module';
import { ReelModule } from '~modules/reel/reel.module';
import { UserModule } from '~modules/user/user.module';
import { AwsModule } from '~services/aws/aws.module';
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
    ReelModule,
    UserModule,
    AwsModule,
    AuctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply()
      .forRoutes()
      // json body parser
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
      .apply(RawBodyMiddleware)
      .forRoutes('/reels/job-state-change');
  }
}
