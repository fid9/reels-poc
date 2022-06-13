import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { makeId } from '~utils/uuid';

import {
  printRequestLog,
  requestToRequestLogInterface,
} from '../logging/logger.helper';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    request.requestId = makeId();
    request.requestStart = process.hrtime();

    // track requests from the frontend
    response.setHeader('X-API-REQUEST-ID', request.requestId);

    return next.handle().pipe(
      // this will not get called on errors, @see exceptionHandler
      tap(() => {
        printRequestLog(requestToRequestLogInterface(request));
      }),
    );
  }
}
