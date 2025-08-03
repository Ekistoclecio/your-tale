import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionMember, MemberRole, MemberStatus } from '../entities/session-member.entity';
import { Session } from '../entities/session.entity';
import { User } from '../entities/user.entity';
import { CreateSessionMemberDto, UpdateSessionMemberDto, SessionMemberResponseDto } from '../dto/session-member.dto';

@Injectable()
export class SessionMemberService {
  constructor(
    @InjectRepository(SessionMember)
    private sessionMemberRepository: Repository<SessionMember>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateSessionMemberDto): Promise<SessionMemberResponseDto> {
    // Verificar se a sessão existe
    const session = await this.sessionRepository.findOne({ where: { id: createDto.sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({ where: { id: createDto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar se o usuário já é membro da sessão
    const existingMember = await this.sessionMemberRepository.findOne({
      where: { sessionId: createDto.sessionId, userId: createDto.userId },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this session');
    }

    // Verificar limite de jogadores se for um player
    if (createDto.role === MemberRole.PLAYER) {
      const activePlayers = await this.sessionMemberRepository.count({
        where: { sessionId: createDto.sessionId, role: MemberRole.PLAYER, status: MemberStatus.ACTIVE },
      });

      if (activePlayers >= session.player_limit) {
        throw new BadRequestException('Session player limit reached');
      }
    }

    const member = this.sessionMemberRepository.create({
      ...createDto,
      joined_at: createDto.joined_at ? new Date(createDto.joined_at) : new Date(),
    });

    const savedMember = await this.sessionMemberRepository.save(member);
    return this.mapToResponseDto(savedMember);
  }

  async findAllBySession(sessionId: string): Promise<SessionMemberResponseDto[]> {
    const members = await this.sessionMemberRepository.find({
      where: { sessionId },
      relations: ['user', 'session'],
    });

    return members.map(member => this.mapToResponseDto(member));
  }

  async findAllByUser(userId: string): Promise<SessionMemberResponseDto[]> {
    const memberships = await this.sessionMemberRepository.find({
      where: { userId },
      relations: ['user', 'session'],
    });

    return memberships.map(member => this.mapToResponseDto(member));
  }

  async findOne(id: string): Promise<SessionMemberResponseDto> {
    const member = await this.sessionMemberRepository.findOne({
      where: { id },
      relations: ['user', 'session'],
    });

    if (!member) {
      throw new NotFoundException('Session member not found');
    }

    return this.mapToResponseDto(member);
  }

  async findBySessionAndUser(sessionId: string, userId: string): Promise<SessionMemberResponseDto> {
    const member = await this.sessionMemberRepository.findOne({
      where: { sessionId, userId },
      relations: ['user', 'session'],
    });

    if (!member) {
      throw new NotFoundException('Session member not found');
    }

    return this.mapToResponseDto(member);
  }

  async update(id: string, updateDto: UpdateSessionMemberDto): Promise<SessionMemberResponseDto> {
    const member = await this.sessionMemberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('Session member not found');
    }

    // Se estiver mudando para player, verificar limite
    if (updateDto.role === MemberRole.PLAYER && member.role !== MemberRole.PLAYER) {
      const session = await this.sessionRepository.findOne({ where: { id: member.sessionId } });
      if (!session) {
        throw new NotFoundException('Session not found');
      }
      
      const activePlayers = await this.sessionMemberRepository.count({
        where: { sessionId: member.sessionId, role: MemberRole.PLAYER, status: MemberStatus.ACTIVE },
      });

      if (activePlayers >= session.player_limit) {
        throw new BadRequestException('Session player limit reached');
      }
    }

    Object.assign(member, updateDto);
    if (updateDto.left_at) {
      member.left_at = new Date(updateDto.left_at);
    }

    const updatedMember = await this.sessionMemberRepository.save(member);
    return this.mapToResponseDto(updatedMember);
  }

  async remove(id: string): Promise<void> {
    const member = await this.sessionMemberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('Session member not found');
    }

    await this.sessionMemberRepository.remove(member);
  }

  async joinSession(sessionId: string, userId: string, role: MemberRole = MemberRole.PLAYER): Promise<SessionMemberResponseDto> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar se o usuário já é membro da sessão
    const existingMember = await this.sessionMemberRepository.findOne({
      where: { sessionId, userId },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this session');
    }

    // Verificar limite de jogadores se for um player
    if (role === MemberRole.PLAYER) {
      const activePlayers = await this.sessionMemberRepository.count({
        where: { sessionId, role: MemberRole.PLAYER, status: MemberStatus.ACTIVE },
      });

      if (activePlayers >= session.player_limit) {
        throw new BadRequestException('Session player limit reached');
      }
    }

    // Criar o membro da sessão
    const member = this.sessionMemberRepository.create({
      sessionId,
      userId,
      role,
      status: MemberStatus.ACTIVE,
      joined_at: new Date(),
    });

    const savedMember = await this.sessionMemberRepository.save(member);
    return this.mapToResponseDto(savedMember);
  }

  async leaveSession(sessionId: string, userId: string): Promise<SessionMemberResponseDto> {
    const member = await this.sessionMemberRepository.findOne({
      where: { sessionId, userId },
    });

    if (!member) {
      throw new NotFoundException('Session member not found');
    }

    return this.update(member.id, {
      status: MemberStatus.INACTIVE,
      left_at: new Date().toISOString(),
    });
  }

  async getActiveMembersCount(sessionId: string): Promise<number> {
    return this.sessionMemberRepository.count({
      where: { sessionId, status: MemberStatus.ACTIVE },
    });
  }

  async getActivePlayersCount(sessionId: string): Promise<number> {
    return this.sessionMemberRepository.count({
      where: { sessionId, role: MemberRole.PLAYER, status: MemberStatus.ACTIVE },
    });
  }

  private mapToResponseDto(member: SessionMember): SessionMemberResponseDto {
    return {
      id: member.id,
      sessionId: member.sessionId,
      userId: member.userId,
      role: member.role,
      status: member.status,
      joined_at: member.joined_at,
      left_at: member.left_at,
      metadata: member.metadata,
      created_at: member.created_at,
      updated_at: member.updated_at,
      user: member.user ? {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar || undefined,
      } : undefined,
      session: member.session ? {
        id: member.session.id,
        title: member.session.title,
        join_code: member.session.join_code,
        status: member.session.status,
      } : undefined,
    };
  }
} 