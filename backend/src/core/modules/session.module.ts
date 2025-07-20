import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { SessionService } from '../providers/session.service';
import { SessionController } from '../controllers/session.controller';
import { SessionMemberService } from '../providers/session-member.service';
import { SessionMember } from '../entities/session-member.entity';
import { Message } from '../entities/message.entity';
import { MessageService } from '../providers/message.service';
import { NoteService } from '../providers/note.service';
import { Note } from '../entities/note.entity';
import { User } from '../entities/user.entity';
import { CharacterModule } from './character.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, SessionMember, Message, Note, User]),
    CharacterModule, // Remover LLMModule daqui
  ],
  providers: [SessionService, SessionMemberService, MessageService, NoteService],
  controllers: [SessionController],
  exports: [SessionService, SessionMemberService, MessageService, NoteService],
})
export class SessionModule {} 