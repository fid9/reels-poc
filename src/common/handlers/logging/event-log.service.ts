/**
 * Route all logs to our custom event logger
 */

import { LoggerService } from '@nestjs/common';

import { Severity } from '~common/handlers/enums/severity.enum';
import { logEvent } from '~common/handlers/logging/logger.helper';

export class EventLogService implements LoggerService {
  private readonly context: string | undefined;
  constructor(context?: string) {
    this.context = context;
  }

  log(message: never, context?: string): void {
    logEvent(
      message,
      {},
      { severity: Severity.Log, resource: context || this.context },
    );
  }

  error(message: never, trace?: string, context?: string): void {
    logEvent(
      message,
      { trace },
      { severity: Severity.Error, resource: context || this.context },
    );
  }

  warn(message: never, context?: string): void {
    logEvent(
      message,
      {},
      { severity: Severity.Warning, resource: context || this.context },
    );
  }

  debug(message: never, context?: string): void {
    logEvent(
      message,
      {},
      { severity: Severity.Debug, resource: context || this.context },
    );
  }

  verbose(message: never, context?: string): void {
    logEvent(
      message,
      {},
      { severity: Severity.Info, resource: context || this.context },
    );
  }
}
