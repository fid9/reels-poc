import { IsBoolean, IsString } from 'class-validator';

export class AuctionCreateDto {
  @IsString()
  readonly issuerId: string;

  @IsBoolean()
  readonly isLive: boolean;
}
