import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    this.userRepo = userRepo;
  }

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  find(criteria: Partial<User>) {
    if (!criteria) return undefined;

    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email=:email or user.id=:id', {
        email: criteria.email,
        id: criteria.id,
      })
      .getOne();

    // return this.userRepo.find({
    //   // where: { id: parseInt(criteria) },
    //   where: {
    //     id: parseInt(criteria),
    //     email: criteria,
    //   },
    //   // where: { email: criteria },
    // });
  }

  async findByQuery(query: string) {
    return [];
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.find({ id });

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attrs);

    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.find({ id });

    if (!user) throw new NotFoundException('User not found');

    return this.userRepo.remove(user);
  }
}
