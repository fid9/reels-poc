import { Severity } from '~common/handlers/enums/severity.enum';
import { EventLogInterface } from '~common/handlers/interfaces/event-log.interface';
import { RequestLogInterface } from '~common/handlers/interfaces/request-log.interface';

export function niceRequestLogPrint({
  responseCode,
  requestId,
  requestUrl,
  remoteIp,
  // requestRoute, used for analytics
  responseTime,
  userId,
}: RequestLogInterface): void {
  const niceResponseCode =
    (responseCode || 0) > 201
      ? `\x1B[31m${responseCode || '-'}\x1B[0m`
      : `\x1B[32m${responseCode || '-'}\x1B[0m`;

  // this log is formatted in a way useful for development - not logging
  // eslint-disable-next-line no-console
  console.log(
    `${new Date().toISOString()} ${niceResponseCode} ${requestUrl} ${remoteIp} ${
      userId || '-'
    } ${requestId || '-'} ${responseTime ? `${responseTime}ms` : '-'}`,
  );
}

export function niceEventLogPrint({
  message,
  code,
  severity,
  resource,
  extra,
  requestId,
}: EventLogInterface): void {
  const niceMessage = [
    Severity.Error,
    Severity.Critical,
    Severity.Fatal,
    Severity.Warning,
  ].includes(severity)
    ? `\x1B[31m${message}\x1B[0m`
    : `\x1B[32m${message}\x1B[0m`;

  const niceExtra =
    extra && Object.keys(extra).length > 0
      ? '\n' + JSON.stringify(extra, null, 2)
      : '';

  // this log is formatted in a way useful for development - not logging
  // eslint-disable-next-line no-console
  console.log(
    `${new Date().toISOString()} ${resource || '-'} ${code} "${niceMessage}" ${
      requestId || '-'
    }${niceExtra}`,
  );
}
