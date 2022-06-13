/**
 * A log of a express request
 */
export interface RequestLogInterface {
  /**
   * Google user id
   */
  userId?: string;

  /**
   * IPv4 address of the remote request
   */
  remoteIp: string | undefined;

  /**
   * Request id
   *  - used in queries and in sentry for debugging
   */
  requestId: string;

  /**
   * The endpoint used
   * - grouping by resource for analytics
   */
  requestRoute: string;

  /**
   * The requested resource
   * - useful for auditing read access
   */
  requestUrl: string;

  /**
   * HTTP response code
   */
  responseCode: number | undefined;

  /**
   * Time it took to handle this request in milliseconds
   */
  responseTime?: number;
}
