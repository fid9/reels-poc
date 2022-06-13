import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class NotImplementedException extends InternalExceptionAbstract {
  constructor(detail?: string, code?: string) {
    super({
      detail,
      message: detail,
      code: code || 'not-implemented',
      httpStatus: HttpStatus.BAD_REQUEST,
      title: 'Not implemented',
    });
  }
}
