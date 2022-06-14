import { Body, Controller, Post } from '@nestjs/common';

import { UserDto } from '~modules/user/dto/user.dto';

import { UserCreateDto } from './dto/user.create.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: UserCreateDto): Promise<UserDto> {
    return (await this.userService.create(body)).toUserDetailsDto();
  }
}
