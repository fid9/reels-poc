import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString } from 'class-validator';

import { FlowerGenusEntity } from '~database/entities';

export class FlowerGenusDetailDto {
  @ApiPropertyOptional({ description: 'Genus Id' })
  @IsString()
  public readonly id: string;

  @ApiPropertyOptional({ description: 'Genus Name' })
  @IsBoolean()
  public readonly name: string;

  @ApiPropertyOptional({ description: 'Genus Description' })
  @IsBoolean()
  public readonly description: string;

  @ApiPropertyOptional({ description: 'Genus Created At' })
  @IsDate()
  @Type(() => Date)
  public readonly createdDate: Date;

  @ApiPropertyOptional({ description: 'Genus Updated At' })
  @IsDate()
  @Type(() => Date)
  public readonly updatedDate: Date;

  @ApiPropertyOptional({ description: 'Entity Version' })
  @IsDate()
  @Type(() => Date)
  public readonly version: number;

  static fromFlowerGenusEntity(
    genusEntity: FlowerGenusEntity,
  ): FlowerGenusDetailDto {
    return {
      id: genusEntity.id,
      name: genusEntity.name,
      description: genusEntity.description,
      createdDate: genusEntity.createdDate,
      updatedDate: genusEntity.updatedDate,
      version: genusEntity.version,
    };
  }
}
