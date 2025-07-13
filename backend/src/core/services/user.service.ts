import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async create(userData: { email: string; password: string; passwordConfirmation: string; name: string }): Promise<User> {
    if (userData.password !== userData.passwordConfirmation) {
      throw new Error('Password and password confirmation do not match');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      credit: 0, // Default credit
    });
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user || undefined;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | undefined> {
    await this.usersRepository.update(id, updateData);
    const user = await this.findById(id);
    return user || undefined;
  }
}
