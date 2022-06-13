import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class UnauthorizedException extends InternalExceptionAbstract {
  constructor(detail?: string, code?: string) {
    super({
      detail,
      code: code || 'unauthorized',
      httpStatus: HttpStatus.UNAUTHORIZED,
      title: 'Unauthorized',
    });
  }
}
