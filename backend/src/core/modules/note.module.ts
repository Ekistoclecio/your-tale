import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../entities/note.entity';
import { NoteService } from '../providers/note.service';
import { NoteController } from '../../api/controllers/note.controller';
import { Session } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Session, SessionMember, User])],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {} 