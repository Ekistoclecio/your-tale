import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from '../entities/session.entity';
import { CreateSessionDto, UpdateSessionDto } from '../dto/session.dto';
import { User } from '../entities/user.entity';
import { SessionMemberService } from './session-member.service';
import { MemberRole, MemberStatus } from '../entities/session-member.entity';
import { MessageService } from './message.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly sessionMemberService: SessionMemberService,
    private readonly messageService: MessageService,
  ) {}

  async create(createDto: CreateSessionDto, creator: User): Promise<Session> {
    if (createDto.player_limit <= 0) throw new BadRequestException('player_limit must be > 0');
    if (new Date(createDto.start_date) <= new Date()) throw new BadRequestException('start_date must be in the future');
    const join_code = this.generateJoinCode();
    const session = this.sessionRepository.create({
      ...createDto,
      join_code,
      creator,
      status: SessionStatus.NOT_STARTED,
      current_players: 1,
      last_activity: new Date(),
    });
    
    const savedSession = await this.sessionRepository.save(session);
    
    // Adicionar o criador como membro da sessão com role MASTER
    await this.sessionMemberService.create({
      sessionId: savedSession.id,
      userId: creator.id,
      role: MemberRole.MASTER,
      status: MemberStatus.ACTIVE,
    });
    
    return savedSession;
  }

  async findMySessions(user: User): Promise<Session[]> {
    // Buscar sessões onde o usuário é criador ou membro
    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoin('session.members', 'member')
      .where('session.creator.id = :userId', { userId: user.id })
      .orWhere('member.userId = :userId', { userId: user.id })
      .orderBy('session.updated_at', 'DESC')
      .getMany();
    
    return sessions;
  }

  async findPublicSessions(): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { is_public: true, status: SessionStatus.NOT_STARTED },
      order: { start_date: 'ASC' },
    });
  }

  async findById(id: string, user: User): Promise<Session> {
    const session = await this.sessionRepository.findOne({ 
      where: { id }, 
      relations: ['creator', 'members', 'members.user'] 
    });
    if (!session) throw new NotFoundException('Session not found');
    
    // Verificar se o usuário é criador ou membro da sessão
    const isCreator = session.creator.id === user.id;
    const isMember = session.members.some(member => member.userId === user.id);
    
    if (!isCreator && !isMember) {
      throw new ForbiddenException('No access to this session');
    }
    
    return session;
  }

  async update(id: string, updateDto: UpdateSessionDto, user: User): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id }, relations: ['creator'] });
    if (!session) throw new NotFoundException('Session not found');
    if (session.creator.id !== user.id) throw new ForbiddenException('Only creator can update');
    Object.assign(session, updateDto);
    session.updated_at = new Date();
    return this.sessionRepository.save(session);
  }

  async join(id: string, user: User, join_code: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id }, relations: ['creator'] });
    if (!session) throw new NotFoundException('Session not found');
    if (session.join_code !== join_code) throw new BadRequestException('Invalid join code');
    if (session.status !== SessionStatus.NOT_STARTED && !session.join_after_start) throw new BadRequestException('Cannot join after start');
    
    // Verificar se o usuário já é membro
    const existingMember = await this.sessionMemberService.findBySessionAndUser(id, user.id).catch(() => null);
    if (existingMember) {
      throw new BadRequestException('User is already a member of this session');
    }
    
    // Adicionar usuário como membro da sessão
    await this.sessionMemberService.joinSession(id, user.id, MemberRole.PLAYER);
    
    // Atualizar contador de jogadores
    const activePlayersCount = await this.sessionMemberService.getActivePlayersCount(id);
    session.current_players = activePlayersCount;
    session.last_activity = new Date();
    
    return this.sessionRepository.save(session);
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async startSession(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== SessionStatus.NOT_STARTED) throw new BadRequestException('Session already started');
    // if (session.start_date > new Date()) throw new BadRequestException('Session start date is in the future');
    // if (session.current_players < session.player_limit) throw new BadRequestException('Not enough players to start');

    session.status = SessionStatus.ACTIVE;

    if (session.is_ai_master) {
      await this.messageService.startAiChat(id);
    }

    return this.sessionRepository.save(session);
  }
} 