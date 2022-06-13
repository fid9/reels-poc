import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FlowerGenusFiltersDto {
  @ApiPropertyOptional({ description: 'Flower Name' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Flower Description' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
