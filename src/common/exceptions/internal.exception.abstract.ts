import { HttpException, HttpStatus } from '@nestjs/common';

import { Severity } from '~common/handlers/enums/severity.enum';
import { EventLogInterface } from '~common/handlers/interfaces/event-log.interface';
import { StatusResponseInterface } from '~common/handlers/interfaces/status-response.interface';

export { HttpStatus } from '@nestjs/common';

/**
 * Base class for all internal Exceptions
 *  - can be converted into a JSON:API ErrorObject
 *  - different Exceptions can have the same code and title, for example
 *     UserNotFound could inherit NotFound but have the same code and title,
 *     if that distinction is not needed for the client but needed in the logic
 */
export abstract class InternalExceptionAbstract extends HttpException {
  /**
   * The Http Status of this error
   *  - defaults the type of error served to the Client
   */
  public readonly httpStatus?: HttpStatus;

  /**
   * Severity used in sentry reporting
   */
  public readonly severity?: Severity;

  /**
   * The ID of the type of error for the client.
   *  - can be as specific as needed
   *  - different Exceptions can have the same code and title
   */
  public readonly code?: string;

  /**
   * The human readable representation of the `code`.
   */
  public readonly title?: string;

  /**
   * Human readable explanation for the _specific_ error.
   */
  public readonly detail?: string;

  /**
   * MetaObject gets sent to the client as-is.
   */
  public readonly meta?: any;

  /**
   * Debug data that is logged but not shown to clients at any time
   */
  public readonly debug?: any;

  protected constructor(data: {
    title: string;
    message?: string;
    httpStatus?: HttpStatus;
    code?: string;
    detail?: string;
  }) {
    super(
      data.detail || data.message || data.title,
      data.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.title = data.title;
    this.httpStatus = data.httpStatus;
    this.code = data.code;
    this.detail = data.detail;
  }

  public toEventLog(): EventLogInterface {
    return {
      message: this.message,
      code: this.code || 'internal-server-error',
      severity: Severity.Error,
      extra: {
        httpStatus: this.httpStatus,
        title: this.title,
        detail: this.detail,
        //exception: {
        //  stack: this.stack,
        //},
      },
    };
  }

  public toStatusResponse(): StatusResponseInterface {
    const status = this.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
    const title = this.title || this.message || 'Internal Server Error';
    const code = this.code || 'internal-server-error';
    return {
      title,
      code,
      httpStatus: status.toString(),
      detail: this.detail,
    };
  }

  public toString(): string {
    return `Exception ${this.httpStatus} ${this.code}: ${this.detail}`;
  }
}
