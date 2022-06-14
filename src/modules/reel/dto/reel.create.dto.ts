import { IsString } from 'class-validator';

export class ReelCreateDto {
  @IsString()
  public readonly issuerId: string;

  @IsString()
  public readonly reelId: string;
}
