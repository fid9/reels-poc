import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime, Settings } from 'luxon';

import { BadRequestException } from '~common/exceptions';

// the server is always in UTC
Settings.defaultZoneName = 'UTC';

/**
 * Date and time
 */
export enum DateTimeFormat {
  DATETIME_STANDARD = 'yyyy-MM-dd HH:mm:ss (ZZZZ)', // 2018-08-31 22:01:36 (PST)
  DATETIME_HUMAN = 'd MMM yyyy HH:mm (ZZZZ)', // 31 Aug 2018 22:01 (PST)
  DATETIME_LONG = 'EEEE, d MMMM, yyyy HH:mm:ss (ZZZZ)', // Friday, 31 August 2018 22:01:36 (PST)
}

/**
 * Date without timezone
 *  - only used for when the date is an identifier, like date of birth
 */
export enum DateFormat {
  DATE_STANDARD = 'yyyy-MM-dd', // 2018-08-31
  DATE_HUMAN = 'd MMM yyyy', // 31 August 2018
  DATE_LONG = 'EEEE, d MMM, yyyy', // Friday, 31 August, 2018
  DATE_YEAR = 'yyyy', // 2018
  DATE_MONTH = 'MMMM yyyy', // August 2018
  DATE_WEEK = "'W'W kkkk", // August 2018
  YEAR_MONTH = 'yyyy-MM', // 2018-08
}

/**
 * Date without timezone
 *  - only used for when the date is an identifier, like date of birth
 */
export enum TimeFormat {
  TIME_HUMAN = 'HH:mm', // 22:01
}

export function isValidTimezone(timeZone: string): boolean {
  if (!Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone) {
    throw 'Time zones not available';
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch (ex) {
    return false;
  }
}

@ValidatorConstraint({ name: 'validTimezone', async: false })
export class ValidTimezone implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(text: string, args: ValidationArguments): boolean {
    return isValidTimezone(text);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    // here you can provide default error message if validation failed
    return '$value is not a valid timezone';
  }
}

/**
 * To show a date in another timezone, you need to convert it
 * @see CompanyModel.formatDate
 * @see src/utils/datetime.unit.ts
 */
export function formatDateTime(
  date: Date,
  timeZone: string,
  dateTimeFormat:
    | string
    | TimeFormat
    | DateTimeFormat
    | DateFormat = DateTimeFormat.DATETIME_STANDARD,
): string {
  if (!date) {
    throw new BadRequestException('No date given');
  }
  return DateTime.fromJSDate(date).setZone(timeZone).toFormat(dateTimeFormat);
}

export type DatePartial = string;

export const datePartialRegex =
  /^(?<year>[0-9]{4})(-((?<month>[0-9]{2}(-(?<day>[0-9]{2}))?)|(W(?<week>[0-9]{2}))))?$/;

export interface DateRange {
  name: string;
  gte?: Date;
  lte?: Date;
  mode: 'day' | 'week' | 'month' | 'year' | 'custom';
  timeZone: string;
}

/**
 * Parse a partial date to an object
 * 2020-20-01 => {year: 2020, month: 20, day: 1}
 * 2020-20 => {year: 2020, month: 20}
 * 2020 => {year: 2020}
 * 2020-W12 => {year: 2020, week: 12}
 * @param partial
 */
export function parsePartialDate(partial: DatePartial): {
  year: number | undefined;
  month: number | undefined;
  day: number | undefined;
  week: number | undefined;
} {
  const match = datePartialRegex.exec(partial);
  if (!match) {
    throw new BadRequestException('Invalid date range');
  }
  const { month, day, week, year } = match.groups as {
    month: string;
    day: string;
    week: string;
    year: string;
  };
  return {
    year: year ? parseInt(year) : undefined,
    month: month ? parseInt(month) : undefined,
    week: week ? parseInt(week) : undefined,
    day: day ? parseInt(day) : undefined,
  };
}

/**
 * Parse a partial date to a DateTime object with a TimeZone
 * @example
 *  2020-20-01 => {year: 2020, month: 20, day: 1}
 *  2020-20 => {year: 2020, month: 20}
 *  2020 => {year: 2020}
 *  2020-W12 => {year: 2020, week: 12}
 * @param data
 * @param timeZone
 */
export function partialDateParseToDateTime(
  data: {
    year: number | undefined;
    month: number | undefined;
    day: number | undefined;
    week: number | undefined;
  },
  timeZone: string,
): DateTime {
  if (data.week) {
    return DateTime.fromObject({
      weekNumber: data.week,
      weekYear: data.year,
      zone: timeZone,
    });
  }
  return DateTime.fromObject({
    year: data.year,
    month: data.month,
    day: data.day,
    zone: timeZone,
  });
}

/**
 * Parse a partial date to a range within a timezone
 * @example
 *  2020-20-01 => from startOf day to endOf day
 *  2020-20 => from startOf month to endOf month
 *  2020 => from startOf year to endOf year
 *  2020-W12 => from startOf week to endOf week
 * @param timeZone
 * @param partial
 */
export function datePartialToRange(
  timeZone: string,
  partial: DatePartial,
): DateRange {
  let mode: 'day' | 'week' | 'month' | 'year';
  const selection = parsePartialDate(partial);
  let end;
  let start;
  if (selection.week) {
    start = DateTime.fromObject({
      weekYear: selection.year,
      weekNumber: selection.week,
      zone: timeZone,
    });
    if (!start.isValid) {
      throw new BadRequestException(
        `Invalid range: ${start.invalidExplanation}`,
      );
    }
    mode = 'week';
    end = start.endOf('week');
  } else {
    start = partialDateParseToDateTime(selection, timeZone);
    if (!start.isValid) {
      throw new BadRequestException(
        `Invalid range: ${start.invalidExplanation}`,
      );
    }
    if (selection.day) {
      mode = 'day';
      end = start.endOf('day');
    } else if (selection.month) {
      mode = 'month';
      end = start.endOf('month');
    } else {
      mode = 'year';
      end = start.endOf('year');
    }
  }
  if (!end.isValid) {
    throw new BadRequestException(`Invalid range: ${end.invalidExplanation}`);
  }
  return {
    name: mode,
    gte: start.toJSDate(),
    lte: end.toJSDate(),
    mode,
    timeZone,
  };
}

export function addHours(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ hours: amount }).toJSDate();
}
export function addDays(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ days: amount }).toJSDate();
}
export function addMonths(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ months: amount }).toJSDate();
}
export function addYears(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ years: amount }).toJSDate();
}
export function differenceInYears(
  date1: Date,
  date2: Date,
): number | undefined {
  return DateTime.fromJSDate(date2)
    .diff(DateTime.fromJSDate(date1), 'years')
    .toObject().years;
}

export function differenceInMinutes(
  date1: Date,
  date2: Date,
): number | undefined {
  return DateTime.fromJSDate(date2)
    .diff(DateTime.fromJSDate(date1), 'minutes')
    .toObject().minutes;
}
export function isBefore(date1: Date, date2: Date): boolean {
  return DateTime.fromJSDate(date1) < DateTime.fromJSDate(date2);
}
export function isAfter(date1: Date, date2: Date): boolean {
  return DateTime.fromJSDate(date1) > DateTime.fromJSDate(date2);
}
export function isEqual(date1: Date, date2: Date): boolean {
  return DateTime.fromJSDate(date1).equals(DateTime.fromJSDate(date2));
}
export function parseISO(date: string): Date {
  return DateTime.fromISO(date).toJSDate();
}

/**
 * Convert time string like "15:22" to Date
 * @param time
 */
export function parseTime(time: string): Date | null {
  const datePartialRegex = /^(?<hour>[0-9]{2}):(?<minute>[0-9]{2})$/;
  const match = datePartialRegex.exec(time);
  if (!match) {
    return null;
  }
  const { minute, hour } = match.groups as { minute: string; hour: string };

  if (!minute || !hour) {
    return null;
  }

  const aDate = new Date();
  aDate.setHours(parseInt(hour));
  aDate.setMinutes(parseInt(minute));

  return aDate;
}
