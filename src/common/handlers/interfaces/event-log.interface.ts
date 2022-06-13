/**
 * An event that happened while processing
 */
import { Severity } from '../enums/severity.enum';

export interface EventLogInterface {
  /**
   * Human readable message of this event
   */
  message: string;

  /**
   * Machine readable equivalent of the message
   */
  code: string;

  /**
   * Severity level of the message
   *  - used by sentry
   */
  severity: Severity;

  /**
   * The Service/Controller/Module function that produced this log
   */
  resource?: string;

  /**
   * Extra data useful for debugging
   */
  extra?: Record<string, unknown>;

  /**
   * The request that this event happened at
   */
  requestId?: string;
}
