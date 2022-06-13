import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { FlowerGenusCreateDto } from '~modules/flower/dto/flower-genus.create.dto';

export class FlowerCreateDto {
  @ApiProperty({ description: 'Genus Name' })
  @IsString()
  @MaxLength(142)
  name: string;

  @ApiProperty({ description: 'Genus Description' })
  @IsString()
  @MaxLength(512)
  description: string;

  @ApiProperty({ description: 'Genus Id' })
  @IsUUID()
  @IsOptional()
  genusId?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => FlowerGenusCreateDto)
  @ApiProperty({ description: 'New Genus' })
  genus?: FlowerGenusCreateDto;
}
