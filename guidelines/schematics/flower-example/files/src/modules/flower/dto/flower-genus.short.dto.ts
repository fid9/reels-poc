import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { FlowerGenusEntity } from '~database/entities';

export class FlowerGenusShortDto {
  @ApiPropertyOptional({ description: 'Genus Id' })
  @IsString()
  public readonly id: string;

  @ApiPropertyOptional({ description: 'Genus Name' })
  @IsBoolean()
  public readonly name: string;

  static fromFlowerGenusEntity(
    genusEntity: FlowerGenusEntity,
  ): FlowerGenusShortDto {
    return {
      id: genusEntity.id,
      name: genusEntity.name,
    };
  }
}
