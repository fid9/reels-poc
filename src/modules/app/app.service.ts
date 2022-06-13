import { Injectable, Inject } from '@nestjs/common';

import { APP_CONFIG, AppConfig } from './app.config';
import { ApiStatus } from './interfaces/api-status.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(APP_CONFIG)
    private appConfig: AppConfig,
  ) {}

  async getStatus(): Promise<ApiStatus> {
    const { environment, release, version, buildTime } = this.appConfig;

    const uptime = process.uptime();
    const d = Math.floor(uptime / (3600 * 24));
    const h = Math.floor((uptime % (3600 * 24)) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const humanReadableUptime = `${d}d ${h}h ${m}m ${s}s`;

    return {
      uptime: humanReadableUptime,
      environment,
      release,
      version,
      buildTime,
    };
  }
}
