import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class NotFoundException extends InternalExceptionAbstract {
  constructor(detail?: string, code?: string) {
    super({
      detail,
      httpStatus: HttpStatus.NOT_FOUND,
      code: code || 'not-found',
      title: 'Not found',
    });
  }
}
