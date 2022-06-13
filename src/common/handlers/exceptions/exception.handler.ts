import { HttpException } from '@nestjs/common';
import { Severity } from '@sentry/types';
import { Response } from 'express';

import { InternalExceptionAbstract } from '~common/exceptions';
import { AuthedRequest } from '~common/handlers/interfaces/authed-request.interface';
import { EventLogInterface } from '~common/handlers/interfaces/event-log.interface';
import { StatusResponseInterface } from '~common/handlers/interfaces/status-response.interface';
import {
  printEventLog,
  printRequestLog,
  requestToRequestLogInterface,
} from '~common/handlers/logging/logger.helper';
import { handleEventLogSentry } from '~services/sentry/sentry.utils';

/**
 * Handle exceptions
 *  - report to sentry if needed
 *  - return a nice error
 */
export async function exceptionHandler(
  request: AuthedRequest,
  response: Response,
  e: unknown,
): Promise<void> {
  let statusResponse: StatusResponseInterface;
  let reportId: string | undefined;
  if (e instanceof HttpException) {
    const status = e.getStatus();
    let eventLog: EventLogInterface;
    if (e instanceof InternalExceptionAbstract) {
      eventLog = e.toEventLog();
      statusResponse = {
        ...e.toStatusResponse(),
        requestId: request.requestId,
      };
    } else {
      eventLog = {
        severity: Severity.Warning,
        message: e.message,
        code: `http-${e.getStatus()}`,
        requestId: request.requestId,
      };
      statusResponse = {
        code: e.name,
        title: e.message,
        httpStatus: status.toString(),
        requestId: request.requestId,
      };
    }

    if (!['http-404'].includes(eventLog.code)) {
      printEventLog(eventLog);
      reportId = await handleEventLogSentry(
        e.message,
        {},
        { exception: e, request, severity: Severity.Warning },
        eventLog,
      );
    }

    if (!response.headersSent) {
      response.status(status);
    }
  } else {
    /**
     * Uncaught exceptions
     *  - something went wrong, log everything
     */

    const message = `Uncaught exception: ${
      (e as any)?.message || (e as any).toString()
    }`;

    const eventLog: EventLogInterface = {
      severity: Severity.Error,
      message,
      code: `uncaught-exception`,
      requestId: request.requestId,
      extra: {
        exception: {
          stack: (e as any)?.stack,
          name: (e as any)?.name,
          message: (e as any)?.message,
        },
      },
    };

    printEventLog(eventLog);

    reportId = await handleEventLogSentry(
      message,
      {},
      { severity: Severity.Error, request, exception: e as any },
      eventLog,
    );

    // dont tell the client anything
    //  the requestId will lead us back to the details
    statusResponse = {
      code: 'uncaught-exception',
      title: 'General server error',
      httpStatus: '500',
      requestId: request.requestId,
    };
    response.status(500);
  }

  // log request since LoggingInterceptor does not handle it
  printRequestLog(requestToRequestLogInterface(request));

  if (response.headersSent) {
    // cant make a response now
    response.end();
    return;
  }

  /**
   * Send error back to user
   */
  if (
    (request.headers.accept && request.headers.accept === 'application/json') ||
    process.env.NICE_HTTP_ERRORS !== 'true'
  ) {
    response.json(statusResponse);
  } else {
    // return a nice user error
    if (reportId && process.env.SENTRY_ENABLE_REPORT_DIALOG === 'true') {
      response.send(
        sentryErrorHTML(statusResponse, reportId, request.userToken),
      );
    } else {
      response.send(defaultErrorHTML(statusResponse));
    }
  }
}

/**
 * Respond as a HTML template
 */
function sentryErrorHTML(
  statusResponse: StatusResponseInterface,
  reportId: string,
  userToken: { userId?: string; username?: string; email?: string },
) {
  const SENTRY_DSN = process.env.SENTRY_DSN;
  if (!SENTRY_DSN) {
    // sentry not configured
    return defaultErrorHTML(statusResponse);
  }

  const user = userToken
    ? {
        id: userToken.userId,
        username: userToken.username,
        email: userToken.email,
      }
    : null;

  return defaultErrorHTML(
    statusResponse,
    `
<script
  src="https://browser.sentry-cdn.com/6.2.1/bundle.min.js"
  integrity="sha384-VXBbKp5OEiVPansWgHB3LwMPIIE2KgmeyEg0N9kG6WPgGxoEdrlnpq6mlEsKLW0B"
  crossorigin="anonymous"
></script>
<script>
  Sentry.init({
    dsn: "${SENTRY_DSN}"
  });
  }
  function showReportDialog() {
    Sentry.showReportDialog({
        eventId: "${reportId}",
        title: "Tell us what happened",
        subtitle: "Giving us more information might help us track down this bug faster.",
        user: ${user}
    });
  }
</script>
`,
    '<a>We were notified of this problem - <a onclick="showReportDialog()">click here</a> if you want to help us solve it.</p>',
  );
}

function defaultErrorHTML(
  statusResponse: StatusResponseInterface,
  extraHead = '',
  extraBody = '',
) {
  // language=HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error ${statusResponse.httpStatus}</title>
    ${extraHead}
</head>
<body>
<h1>Sorry, we could not load this page</h1>
<h2>${statusResponse.title}: ${statusResponse.detail}</h2>
${extraBody}
</body>
</html>
  `;
}
