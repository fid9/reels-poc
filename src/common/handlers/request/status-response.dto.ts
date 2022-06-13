import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { StatusResponseInterface } from '~common/handlers/interfaces/status-response.interface';

export class StatusResponseDto implements StatusResponseInterface {
  @IsString()
  @ApiProperty({ description: 'Status Response Code' })
  code: string;

  @IsString()
  @ApiProperty({ description: 'Status Response Title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'Status Response Detail' })
  detail: string;

  @ApiProperty({ description: 'Status Response Meta' })
  meta: any;

  @IsString()
  @ApiProperty({ description: 'Status Response Http Status' })
  httpStatus: string;

  public static toStatusResponseInterface(data: {
    detail?: string;
    httpStatus?: string;
    meta?: any;
    code?: string;
    title?: string;
  }): StatusResponseDto {
    return {
      title: data.title || 'Success',
      code: data.code || 'http-ok',
      httpStatus: data.httpStatus?.toString() || HttpStatus.OK.toString(),
      detail: data.detail || '',
      meta: data.meta ? JSON.parse(JSON.stringify(data.meta)) : undefined,
    };
  }
}
