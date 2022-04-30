import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users?.length) throw new BadRequestException('Email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    return this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (!users?.length) throw new NotFoundException('Email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const saltedHash = `${salt}.${hash.toString('hex')}`;

    return this.usersService.find(email, saltedHash);
  }
}