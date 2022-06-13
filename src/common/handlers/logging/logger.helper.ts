import { getClientIp } from 'request-ip';

import { InternalExceptionAbstract } from '~common/exceptions';
import { Severity } from '~common/handlers/enums/severity.enum';
import { AuthedRequest } from '~common/handlers/interfaces/authed-request.interface';
import { EventLogInterface } from '~common/handlers/interfaces/event-log.interface';
import { RequestLogInterface } from '~common/handlers/interfaces/request-log.interface';
import {
  niceEventLogPrint,
  niceRequestLogPrint,
} from '~common/handlers/logging/console.helper';
import { handleEventLogSentry } from '~services/sentry/sentry.utils';

/**
 * Log events to CloudWatch and Sentry
 * @param message human readable message
 * @param extra extra context variables usable in debugging
 * @param [context]
 * @param [context.exception] exception that prompted this log
 * @param [context.request] express request object
 * @param [context.resource] a custom resource string
 * @param [context.severity]
 */
export function logEvent(
  message: string,
  extra: Record<string, unknown>,
  context: {
    exception?: Error;
    request?: AuthedRequest;
    resource?: string;
    severity: Severity;
    code?: string;
  },
): void {
  const eventLog: EventLogInterface = {
    message,
    code:
      context?.code ||
      (context?.exception as InternalExceptionAbstract)?.code ||
      context?.exception?.name ||
      context.severity,
    severity: context?.severity,
    resource: context?.resource,
    extra: extra && Object.keys(extra).length > 0 ? extra : undefined,
    requestId: (context?.request?.requestId || extra?.requestId) as string,
  };

  // append the exception
  if (context.exception) {
    if (!eventLog.extra) {
      eventLog.extra = {};
    }
    eventLog.extra.exception = {
      stack: context.exception.stack,
      name: context.exception.name,
      message: context.exception.message,
    };
  }

  printEventLog(eventLog);

  handleEventLogSentry(message, extra, context, eventLog)
    // ignore async response, this function will not throw
    .then();
}

export function printEventLog(data: EventLogInterface): void {
  if (process.env.LOG_FORMAT !== 'json') {
    niceEventLogPrint(data);
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
  }
}

export function requestToRequestLogInterface(
  request: AuthedRequest,
): RequestLogInterface {
  const end = process.hrtime(request.requestStart);

  const data: RequestLogInterface = {
    remoteIp: getClientIp(request) || undefined,
    requestId: request.requestId,
    requestRoute: `${request.method}:${request.route?.path}`,
    requestUrl: `${request.method}:${request.url}`,
    responseCode: request.res?.statusCode,
  };

  if (request.requestStart) {
    data.responseTime = (end[0] * 1e9 + end[1]) / 1000000;
  }

  // logged in users
  if (request.userToken) {
    data.userId = request.userToken.userId;
  }

  return data;
}

export function printRequestLog(data: RequestLogInterface): void {
  if (process.env.LOG_FORMAT !== 'json') {
    niceRequestLogPrint(data);
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
  }
}
