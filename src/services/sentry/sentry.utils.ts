import { Scope } from '@sentry/hub';
import * as Sentry from '@sentry/minimal';
import { Event, Severity } from '@sentry/types';
import { getClientIp } from 'request-ip';

import { InternalExceptionAbstract } from '~common/exceptions';
import { AuthedRequest } from '~common/handlers/interfaces/authed-request.interface';
import { EventLogInterface } from '~common/handlers/interfaces/event-log.interface';
import { printEventLog } from '~common/handlers/logging/logger.helper';

function applyRequest(scope: Scope, request: AuthedRequest): void {
  // user details
  const user: any = {};
  if (request.userToken) {
    if (request.userToken.username) {
      user.username = request.userToken.username;
    }
    if (request.userToken.userId) {
      user.id = request.userToken.userId;
    }
  }
  if (request.headers) {
    user.ip_address = getClientIp(request);
    scope.setExtra('referer', request.headers.referer);
    scope.setExtra('user-agent', request.headers['user-agent']);
  }
  scope.setUser(user);

  if (request.requestId) {
    scope.setTag('requestId', request.requestId);
  }

  scope.setTag('requestRoute', `${request.method}:${request.route?.path}`);

  scope.setExtra('requestUrl', request.url);
}

/**
 * Report event to sentry with some nice context
 */
export async function sendSentryEvent(
  event: Event,
  context: { request?: AuthedRequest; resource?: string; severity?: Severity },
): Promise<string> {
  return new Promise((resolve) => {
    Sentry.withScope(async (scope) => {
      if (context.request) {
        applyRequest(scope, context.request);
      }
      scope.setLevel(context.severity || Severity.Error);
      if (context.resource) {
        scope.setTag('resource', context.resource);
      }

      resolve(Sentry.captureEvent(event));
    });
  });
}

/**
 * Report exception to sentry with some nice context
 */
export async function sendSentryException(
  exception: unknown,
  context: { request?: AuthedRequest },
): Promise<string> {
  return new Promise((resolve) => {
    Sentry.withScope(async (scope) => {
      if (context.request) {
        applyRequest(scope, context.request);
      }
      scope.setLevel(Severity.Error);

      if (exception instanceof InternalExceptionAbstract) {
        scope.setExtra('meta', exception.meta);
        scope.setExtra('detail', exception.detail);
        scope.setTag('httpStatus', exception.httpStatus?.toString());
        scope.setTag('code', exception.code);
      }

      resolve(Sentry.captureException(exception));
    });
  });
}

export async function handleEventLogSentry(
  message: string,
  extra: Record<string, unknown>,
  context: {
    exception?: Error;
    request?: AuthedRequest;
    resource?: string;
    severity: Severity;
  },
  eventLog: EventLogInterface,
): Promise<string | undefined> {
  if (
    // log errors to sentry
    !eventLog?.severity ||
    [
      Severity.Error,
      Severity.Critical,
      Severity.Fatal,
      Severity.Warning,
    ].includes(eventLog.severity)
  ) {
    // report to sentry and wait for reportId
    try {
      if (context?.exception) {
        return await sendSentryException(context.exception, context);
      }
      return await sendSentryEvent({ message, extra }, context);
    } catch (e) {
      printEventLog({
        message: 'Error while logging to Sentry',
        code: 'sentry-error',
        severity: Severity.Critical,
        requestId: eventLog.requestId,
        extra: {
          exception: {
            stack: e.stack,
            name: e.name,
            message: e.message,
          },
        },
      });
    }
  }
}
