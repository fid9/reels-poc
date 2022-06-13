import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  Matches,
  Validate,
} from 'class-validator';

import {
  DatePartial,
  datePartialRegex,
  datePartialToRange,
  DateRange,
  ValidTimezone,
} from '~utils/datetime';

export class FlowerFiltersDto {
  @ApiPropertyOptional({ description: 'Flower Name', example: 'Ficus' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Flower Description', example: 'Large' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @Matches(datePartialRegex)
  @IsOptional()
  public readonly range?: DatePartial;

  @IsOptional()
  @Validate(ValidTimezone)
  public readonly timezone: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public readonly timestampFrom?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public readonly timestampTo?: Date;

  public getRange(timeZone = 'UTC'): DateRange | undefined {
    if (this.range) {
      return datePartialToRange(this.timezone || timeZone, this.range);
    } else if (this.timestampFrom && this.timestampTo) {
      return {
        name: this.range || 'custom',
        gte: this.timestampFrom,
        lte: this.timestampTo,
        mode: 'custom',
        timeZone: this.timezone || timeZone,
      };
    } else return undefined;
  }
}
