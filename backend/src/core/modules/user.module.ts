import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { UserService } from '../providers/user.service';
import { AuthService } from '../providers/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtGlobalModule } from './jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtGlobalModule,
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [AuthController, UserController],
  exports: [UserService, AuthService],
})
export class UserModule {} 