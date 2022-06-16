import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class AuctionUpdateDto {
  @IsBoolean()
  @IsOptional()
  readonly isLive?: boolean;

  @IsNumber()
  @IsOptional()
  readonly currentPrice?: number;

  @IsNumber()
  @IsOptional()
  readonly percentageNumber?: number;
}
