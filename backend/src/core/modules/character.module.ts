import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../entities/character.entity';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { CharacterService } from '../providers/character.service';
import { CharacterController } from '../controllers/character.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, User, Session, SessionMember]),
  ],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {} 