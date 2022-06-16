import { IsString } from 'class-validator';

export class AuctionCreateDto {
  @IsString()
  readonly issuerId: string;
}
