import { Controller, Get, Header, Logger, Query, Req } from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { Request } from 'express';

import { ConflictException } from '~common/exceptions';
import { Severity } from '~common/handlers/enums/severity.enum';
import { logEvent } from '~common/handlers/logging/logger.helper';
import { serialize } from '~common/handlers/logging/serialize.helpers';
import { ApiStatusDto } from '~modules/app/dto/api-status.dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'no-cache, no-store')
  @ApiImplicitQuery({ name: 'dumpHeaders', required: false })
  @ApiImplicitQuery({ name: 'testExceptions', required: false })
  public async getStatus(
    @Req() request: Request,
    @Query('dumpHeaders') dumpHeaders?: string,
    @Query('testExceptions') testExceptions?: string,
  ): Promise<ApiStatusDto> {
    if (dumpHeaders == '34w5yu6r7iyotkjh') {
      logEvent(
        'Request Dump',
        {
          request: serialize(request),
        },
        { severity: Severity.Log },
      );
    }
    if (testExceptions === 'sduij5h4gehrjyrt') {
      throw new ConflictException('Test Exception', 'test-exception');
    }

    const apiStatus = await this.appService.getStatus();

    return ApiStatusDto.fromApiStatus(apiStatus);
  }
}
