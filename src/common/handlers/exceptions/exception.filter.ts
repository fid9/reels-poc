import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { exceptionHandler } from './exception.handler';

/**
 * Catch all uncaught exceptions
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    await exceptionHandler(req, res, exception);
  }
}
