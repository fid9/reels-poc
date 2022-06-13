import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class TimeoutException extends InternalExceptionAbstract {
  constructor(detail?: string, code?: string) {
    super({
      detail,
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      code: code || 'timeout',
      title: 'Request Timeout',
    });
  }
}
