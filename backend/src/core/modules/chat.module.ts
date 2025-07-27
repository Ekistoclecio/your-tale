import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatService } from '../providers/chat.service';
import { WsJwtAuthGuard } from '../guards/ws-jwt-auth.guard';
import { User } from '../entities/user.entity';
import { SessionMember } from '../entities/session-member.entity';
import { Message } from '../entities/message.entity';
import { Session } from '../entities/session.entity';
import { UserService } from '../providers/user.service';
import { MessageService } from '../providers/message.service';
import { SessionMemberService } from '../providers/session-member.service';
import { QueueModule } from './queue.module';
import { CharacterModule } from './character.module';
import { JwtGlobalModule } from './jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionMember, Message, Session]),
    JwtGlobalModule,
    forwardRef(() => QueueModule),
    CharacterModule, // Importar CharacterModule para ter acesso ao CharacterService
  ],
  providers: [
    ChatGateway,
    ChatService,
    WsJwtAuthGuard,
    UserService,
    MessageService,
    SessionMemberService,
  ],
  exports: [ChatService],
})
export class ChatModule {} 