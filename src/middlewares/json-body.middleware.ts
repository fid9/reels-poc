import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response, json } from 'express';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    return json()(req, res, next);
  }
}
