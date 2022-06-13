import { Logger, QueryRunner } from 'typeorm';

import { Severity } from '~common/handlers/enums/severity.enum';
import { logEvent } from '~common/handlers/logging/logger.helper';

const allEvents = [
  'query',
  'schema',
  'error',
  'warn',
  'info',
  'log',
  'migration',
];

type TypeORMLoggerOptions =
  | boolean
  | 'all'
  | (
      | 'all'
      | 'false'
      | 'query'
      | 'schema'
      | 'error'
      | 'warn'
      | 'info'
      | 'log'
      | 'migration'
    )[];

export class TypeORMLogger implements Logger {
  private readonly logEvents: Set<string>;

  constructor(options: TypeORMLoggerOptions) {
    let events = ['schema', 'warn', 'migration'];

    if (Array.isArray(options)) {
      if (options[0] === 'all') {
        events = [...events, ...allEvents];
      } else if (options[0] === 'false') {
      } else {
        events = [...events, ...options];
      }
    } else if (options === 'all') {
      events = [...events, ...allEvents];
    }

    // else options = false | 'false' | undefined

    this.logEvents = new Set(events);
  }

  log(
    level: 'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration',
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
  ): void {
    if (!this.logEvents.has(level)) {
      return;
    }

    let severity: Severity;
    switch (level) {
      case 'log':
        severity = Severity.Log;
        break;
      case 'info':
        severity = Severity.Info;
        break;
      case 'warn':
        severity = Severity.Warning;
        break;
      case 'error':
        severity = Severity.Error;
        break;
      default:
        severity = Severity.Debug;
        break;
    }

    logEvent(message, {}, { severity, code: `typeorm-${level}` });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logMigration(message: string, queryRunner?: QueryRunner): void {
    if (!this.logEvents.has('migration')) {
      return;
    }
    logEvent(
      message,
      {},
      { severity: Severity.Log, code: `typeorm-migration` },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (!this.logEvents.has('log')) {
      return;
    }
    logEvent(
      'TypeORM Query',
      { query, parameters },
      { severity: Severity.Debug, code: `typeorm-query` },
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
  ): void {
    if (!this.logEvents.has('error')) {
      return;
    }
    logEvent(
      typeof error === 'string' ? error : 'TypeORM Query Error',
      { query, parameters },
      {
        severity: Severity.Error,
        exception: error instanceof Error ? error : undefined,
        code: `typeorm-query-error`,
      },
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
  ): void {
    if (!this.logEvents.has('warn')) {
      return;
    }
    logEvent(
      'TypeORM Slow Query',
      { query, parameters },
      {
        severity: Severity.Warning,
        code: `typeorm-query-slow`,
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    if (!this.logEvents.has('schema')) {
      return;
    }
    logEvent(
      message,
      {},
      {
        severity: Severity.Info,
        code: `typeorm-schema`,
      },
    );
  }
}
