import { Controller, Post, Get, Patch, Put, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SessionService } from '../../core/providers/session.service';
import { SessionMemberService } from '../../core/providers/session-member.service';
import { MessageService } from '../../core/providers/message.service';
import { CreateSessionDto, UpdateSessionDto, JoinSessionDto } from '../../core/dto/session.dto';
import { CreateSessionMemberDto, UpdateSessionMemberDto, SessionMemberResponseDto } from '../../core/dto/session-member.dto';
import { CreateMessageDto, UpdateMessageDto, MessageResponseDto, GetMessagesQueryDto } from '../../core/dto/message.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { User } from '../../core/entities/user.entity';
import { MemberRole } from '../../core/entities/session-member.entity';

@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionMemberService: SessionMemberService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  async create(@Body() dto: CreateSessionDto, @CurrentUser() user: User) {
    return await this.sessionService.create(dto, user);
  }

  @Get('my')
  async mySessions(@CurrentUser() user: User) {
    return this.sessionService.findMySessions(user);
  }

  @Get('public')
  async publicSessions() {
    return this.sessionService.findPublicSessions();
  }

  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sessionService.findById(id, user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSessionDto, @CurrentUser() user: User) {
    return this.sessionService.update(id, dto, user);
  }

  @Post(':id/join')
  async join(@Param('id') id: string, @Body() dto: JoinSessionDto, @CurrentUser() user: User) {
    return this.sessionService.join(id, user, dto.join_code);
  }

  // ===== ENDPOINTS DE MEMBROS =====

  @Post('members')
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param('id') sessionId: string,
    @Body() createDto: CreateSessionMemberDto,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se o usuário atual tem permissão para adicionar membros
    const session = await this.sessionService.findById(sessionId, user);
    if (session.creator.id !== user.id) {
      throw new Error('Only session creator can add members');
    }
    
    return this.sessionMemberService.create({
      ...createDto,
    });
  }

  @Get(':id/members')
  async getSessionMembers(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto[]> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.findAllBySession(sessionId);
  }

  @Get('my/memberships')
  async getMyMemberships(@CurrentUser() user: User): Promise<SessionMemberResponseDto[]> {
    return this.sessionMemberService.findAllByUser(user.id);
  }

  @Get(':id/members/:memberId')
  async getMember(
    @Param('id') sessionId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.findOne(memberId);
  }

  @Get(':id/members/user/:userId')
  async getMemberByUser(
    @Param('id') sessionId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.findBySessionAndUser(sessionId, userId);
  }

  @Put(':id/members/:memberId')
  async updateMember(
    @Param('id') sessionId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateSessionMemberDto,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se o usuário atual tem permissão para atualizar membros
    const session = await this.sessionService.findById(sessionId, user);
    if (session.creator.id !== user.id) {
      throw new Error('Only session creator can update members');
    }
    
    return this.sessionMemberService.update(memberId, updateDto);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id') sessionId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    // Verificar se o usuário atual tem permissão para remover membros
    const session = await this.sessionService.findById(sessionId, user);
    if (session.creator.id !== user.id) {
      throw new Error('Only session creator can remove members');
    }
    
    return this.sessionMemberService.remove(memberId);
  }

  @Post(':id/members/join')
  @HttpCode(HttpStatus.CREATED)
  async joinAsMember(
    @Param('id') sessionId: string,
    @Body() body: { role?: MemberRole },
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se a sessão existe e se o usuário pode acessá-la
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.joinSession(sessionId, user.id, body.role);
  }

  @Post(':id/members/leave')
  async leaveAsMember(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se a sessão existe e se o usuário pode acessá-la
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.leaveSession(sessionId, user.id);
  }

  @Get(':id/members/count/active')
  async getActiveMembersCount(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    const count = await this.sessionMemberService.getActiveMembersCount(sessionId);
    return { count };
  }

  @Get(':id/members/count/players')
  async getActivePlayersCount(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    const count = await this.sessionMemberService.getActivePlayersCount(sessionId);
    return { count };
  }

  // ===== ENDPOINTS DE MENSAGENS =====

  @Get(':id/messages')
  async getMessages(
    @Param('id') sessionId: string,
    @Query() query: GetMessagesQueryDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto[]> {
    return this.messageService.findAll(sessionId, user.id, query);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Param('id') sessionId: string,
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.create(sessionId, createMessageDto, user.id);
  }

  @Get('messages/:messageId')
  async getMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.findOne(messageId, user.id);
  }

  @Patch('messages/:messageId')
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.update(messageId, updateMessageDto, user.id);
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.messageService.delete(messageId, user.id);
  }

  @Get(':id/messages/count')
  async getMessageCount(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return this.messageService.getMessageCount(sessionId, user.id);
  }
} 