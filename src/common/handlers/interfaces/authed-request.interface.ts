import { Request } from 'express';

/**
 * Types the Express Request with the custom patient and backend user tokens
 */
export interface AuthedRequest extends Request {
  userToken: {
    userId: string;
    username: string;
  };
  requestId: string;
  requestStart: [number, number];
}
