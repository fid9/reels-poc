import { INestApplication, ValidationPipe } from '@nestjs/common';

import { ValidationException } from '~common/exceptions';
import { GlobalExceptionFilter } from '~common/handlers/exceptions/exception.filter';
import { flatten } from '~utils/validation';

export function globalPipes(app: INestApplication): void {
  // send exceptions as formatted  error messages
  app.useGlobalFilters(new GlobalExceptionFilter());

  // validate request DTO with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // use DTOs as runtime types
      whitelist: true, // strip non-whitelisted
      // forbidNonWhitelisted: true // throw on non-whitelisted
      exceptionFactory: (fieldErrors) => {
        return ValidationException.fromFieldErrors(flatten(fieldErrors));
      },
    }),
  );
}
