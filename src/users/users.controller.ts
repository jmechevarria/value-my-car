import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDTO } from './dtos/create.user.dto';
import { UpdateUserDTO } from './dtos/update.user.dto';
import { UserDTO } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDTO) // format outgoing responses, by serializing it using the rules we put in the DTO
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('auth/signout')
  async signOut(@Session() session: any) {
    delete session.userId;
  }

  @Post('auth/signup')
  async signup(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Post('auth/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Get()
  async find(@Query() query: Partial<UserDTO>) {
    const email = query.email;
    if (email) {
      const user = await this.usersService.find({ email });
      return user;
    } else {
      const user = await this.usersService.findAll();
      return user;
    }
  }

  @Get(':id')
  async findByID(@Param('id') id: string) {
    return await this.usersService.find({ id: parseInt(id) });
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
