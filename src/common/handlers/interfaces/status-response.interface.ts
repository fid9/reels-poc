export interface StatusResponseInterface {
  /**
   * Message / Human Readable Status
   */
  title: string | undefined;

  /**
   * Machine readable equivalent of 'title'
   */
  code: string | undefined;

  /**
   * Human readable explanation of this response
   */
  detail?: string;

  /**
   * 'code' translated into a HTTP status code
   */
  httpStatus?: string;

  /**
   * Express/AWS/Custom request Id
   */
  requestId?: string;

  /**
   * Free-form data returned by logic
   */
  meta?: any;
}
