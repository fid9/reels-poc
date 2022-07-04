import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class AuctionDetailsDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly issuerId: string;

  @IsBoolean()
  readonly isLive: boolean;

  @IsNumber()
  readonly currentPrice: number;

  @IsNumber()
  readonly percentageNumber: number;

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
}
