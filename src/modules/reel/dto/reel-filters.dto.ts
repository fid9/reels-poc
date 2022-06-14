import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReelFiltersDto {
  @ApiPropertyOptional({ description: 'Flower Name', example: 'Ficus' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Flower Description', example: 'Large' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
