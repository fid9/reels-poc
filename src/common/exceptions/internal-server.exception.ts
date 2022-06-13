import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class InternalServerException extends InternalExceptionAbstract {
  constructor(detail?: string, code?: string) {
    super({
      detail,
      code: code || 'internal-server-error',
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      message: detail,
    });
  }
}
