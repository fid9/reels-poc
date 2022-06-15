import { IsString } from 'class-validator';

export class ReelLikeDto {
  @IsString()
  public readonly userId: string;

  @IsString()
  public readonly reelId: string;
}
