import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ExtraErrorData,
  RewriteFrames,
  Transaction,
} from '@sentry/integrations';
import * as Sentry from '@sentry/node';

import version from '../../version';

@Injectable()
export class SentryModule implements OnModuleInit {
  onModuleInit(): void {
    Sentry.init({
      debug: false,
      dsn: process.env.SENTRY_DSN,
      release: version.release,
      environment: process.env.STAGE,
      integrations: [
        new ExtraErrorData(),
        new RewriteFrames({
          // @ts-ignore
          root: globalThis.__rootdir__,
        }),
        new Transaction(),
      ],
    });
  }
}
