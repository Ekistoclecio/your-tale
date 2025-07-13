import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../../api/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private mapUserToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      credit: user.credit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async findByEmailResponse(email: string): Promise<UserResponseDto | undefined> {
    const user = await this.findByEmail(email);
    return user ? this.mapUserToResponseDto(user) : undefined;
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

  async findByIdResponse(id: string): Promise<UserResponseDto | undefined> {
    const user = await this.findById(id);
    return user ? this.mapUserToResponseDto(user) : undefined;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | undefined> {
    await this.usersRepository.update(id, updateData);
    const user = await this.findById(id);
    return user || undefined;
  }

  async updateResponse(id: string, updateData: Partial<User>): Promise<UserResponseDto | undefined> {
    const user = await this.update(id, updateData);
    return user ? this.mapUserToResponseDto(user) : undefined;
  }
}
