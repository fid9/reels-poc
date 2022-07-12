import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';

import { Severity } from '~common/handlers/enums/severity.enum';
import { EventLogService } from '~common/handlers/logging/event-log.service';
import { logEvent } from '~common/handlers/logging/logger.helper';
import { RequestLogInterceptor } from '~common/handlers/request/request-log.interceptor';
import { APP_CONFIG, AppConfig } from '~modules/app/app.config';
import { AppModule } from '~modules/app/app.module';
import { globalPipes } from '~modules/app/app.pipes';
import { usage } from '~utils/usage';
import version from '~version';

/**
 * Main application bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false, // force nest.js to bubble up exceptions
    bodyParser: false,
  });

  app.useLogger(new EventLogService());

  const appConfig = app.get<AppConfig>(APP_CONFIG);
  const {
    cors: { all: corsAll, url: corsUrl },
    swagger: {
      prefix: swaggerPrefix,
      authPassword: swaggerAuthPassword,
      authUsername: swaggerAuthUsername,
    },
    log: { memoryUsage: logMemoryUsage, requests: logRequests },
  } = appConfig;

  // enable cors
  app.enableCors({
    maxAge: 3600,
    credentials: true,
    origin: corsUrl
      ? corsUrl
      : (origin, callback) => {
          callback(null, corsAll);
        },
  });

  // log requests
  if (logRequests) {
    app.useGlobalInterceptors(new RequestLogInterceptor());
  }

  /**
   * Global pipes
   *  - use this when you want the pipes to be applied in tests
   */
  globalPipes(app);

  // log memory usage
  if (logMemoryUsage) {
    setInterval(
      () => logEvent('Memory Usage', usage(), { severity: Severity.Info }),
      1000 * 60 * 15,
    );
  }

  if (swaggerPrefix) {
    const config = new DocumentBuilder()
      .setTitle('Api Documentation')
      .setVersion(version.release)
      .build();

    if (swaggerAuthUsername && swaggerAuthPassword) {
      app.use(
        `/${swaggerPrefix}`,
        expressBasicAuth({
          challenge: true,
          users: { [swaggerAuthUsername]: swaggerAuthPassword },
        }),
      );
    }

    SwaggerModule.setup(
      swaggerPrefix,
      app,
      SwaggerModule.createDocument(app, config),
    );
  }

  await app.listen(appConfig.port, '0.0.0.0');
}

bootstrap().catch((e) => {
  logEvent(
    'Bootstrap Error',
    {},
    { exception: e, severity: Severity.Critical },
  );
  process.exit(1);
});
