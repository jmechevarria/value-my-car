import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create.user.dto';
import { UpdateUserDTO } from './dtos/update.user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Serialize(UserDTO) // format outgoing responses, by serializing it using the rules we put in the DT
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('auth/signup')
  signup(@Body() body: CreateUserDTO) {
    return this.authService.signup(body.email, body.password);
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  async findByID(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    return user;
  }

  @Patch(':id')
  updateByID(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete(':id')
  deleteByID(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
