import { ValidationError } from 'class-validator';

import { StatusResponseInterface } from '~common/handlers/interfaces/status-response.interface';
import { FieldErrors, flatten } from '~utils/validation';

import {
  HttpStatus,
  InternalExceptionAbstract,
} from './internal.exception.abstract';

export class ValidationException extends InternalExceptionAbstract {
  public fieldErrors: FieldErrors;

  constructor(fieldErrors: FieldErrors = {}, detail?: string) {
    super({
      detail,
      httpStatus: HttpStatus.BAD_REQUEST,
      title: 'Validation exception',
      message: `${ValidationException._makeMessageFromFieldErrors(
        fieldErrors,
      )}`,
      code: 'validation-exception',
    });
    this.fieldErrors = fieldErrors;
  }

  public static _makeMessageFromFieldErrors(fieldError: FieldErrors): string {
    return Object.entries(fieldError)
      .reduce((m: string[], [k, v]) => {
        m.push(`'${k}' ${v.message}`);
        return m;
      }, [] as string[])
      .join(', ');
  }

  public static fromFieldErrors(
    fieldError: FieldErrors,
    detail?: string,
  ): ValidationException {
    return new ValidationException(fieldError, detail);
  }

  public static fromValidationErrors(
    validationErrors: ValidationError | ValidationError[],
    detail: string,
  ): ValidationException {
    return new ValidationException(
      flatten(
        Array.isArray(validationErrors) ? validationErrors : [validationErrors],
      ),
      detail,
    );
  }

  public toStatusResponse(): StatusResponseInterface {
    return {
      meta: this.fieldErrors,
      detail: this.detail,
      httpStatus: this.httpStatus?.toString(),
      title: this.title,
      code: this.code,
    };
  }
}
