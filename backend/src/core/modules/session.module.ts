import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { SessionService } from '../providers/session.service';
import { SessionController } from '../../api/controllers/session.controller';
import { SessionMemberService } from '../providers/session-member.service';
import { SessionMember } from '../entities/session-member.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionMember, User])],
  providers: [SessionService, SessionMemberService],
  controllers: [SessionController],
  exports: [SessionService, SessionMemberService],
})
export class SessionModule {} 