import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    return bodyParser.raw({ type: '*/*' })(req, res, next);
  }
}
