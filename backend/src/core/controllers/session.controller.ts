import { Controller, Post, Get, Patch, Put, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SessionService } from '../../core/providers/session.service';
import { SessionMemberService } from '../../core/providers/session-member.service';
import { MessageService } from '../../core/providers/message.service';
import { NoteService } from '../../core/providers/note.service';
import { CreateSessionDto, UpdateSessionDto, JoinSessionDto, GetSessionsQueryDto } from '../../core/dto/session.dto';
import { CreateSessionMemberDto, UpdateSessionMemberDto, SessionMemberResponseDto } from '../../core/dto/session-member.dto';
import { CreateMessageDto, UpdateMessageDto, MessageResponseDto, GetMessagesQueryDto } from '../../core/dto/message.dto';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto, GetNotesQueryDto } from '../../core/dto/note.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { User } from '../../core/entities/user.entity';
import { MemberRole } from '../../core/entities/session-member.entity';
import { PaginatedResponseDto } from '../../core/dto/pagination.dto';

@ApiTags('sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionMemberService: SessionMemberService,
    private readonly messageService: MessageService,
    private readonly noteService: NoteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova sessão de RPG' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sessão criada com sucesso',
    type: Object
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos' 
  })
  @ApiBody({ type: CreateSessionDto })
  async create(@Body() dto: CreateSessionDto, @CurrentUser() user: User) {
    return await this.sessionService.create(dto, user);
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar sessões do usuário logado' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de sessões do usuário',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Session' }
        },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 3 },
        totalItems: { type: 'number', example: 25 },
        itemsPerPage: { type: 'number', example: 10 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  async mySessions(
    @CurrentUser() user: User,
    @Query() query: GetSessionsQueryDto,
  ) {
    return this.sessionService.findMySessions(user, query);
  }

  @Get('public')
  @ApiOperation({ summary: 'Listar sessões públicas disponíveis' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de sessões públicas',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Session' }
        },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 5 },
        totalItems: { type: 'number', example: 50 },
        itemsPerPage: { type: 'number', example: 10 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  async publicSessions(@Query() query: GetSessionsQueryDto) {
    return this.sessionService.findPublicSessions(query);
  }

  @Get('by-code/:code')
  @ApiOperation({ summary: 'Buscar ID da sessão por código de acesso' })
  @ApiParam({ name: 'code', description: 'Código de acesso da sessão', example: 'ABC123' })
  @ApiResponse({ 
    status: 200, 
    description: 'ID da sessão encontrada',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sessão não encontrada' 
  })
  async getSessionByCode(@Param('code') code: string) {
    return this.sessionService.findByJoinCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma sessão específica' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes da sessão',
    type: Object
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sessão não encontrada' 
  })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sessionService.findById(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sessão atualizada com sucesso',
    type: Object
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sessão não encontrada' 
  })
  @ApiBody({ type: UpdateSessionDto })
  async update(@Param('id') id: string, @Body() dto: UpdateSessionDto, @CurrentUser() user: User) {
    return this.sessionService.update(id, dto, user);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Entrar em uma sessão usando código de acesso' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Entrou na sessão com sucesso',
    type: Object
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Código de acesso inválido' 
  })
  @ApiBody({ type: JoinSessionDto })
  async join(@Param('id') id: string, @Body() dto: JoinSessionDto, @CurrentUser() user: User) {
    return this.sessionService.join(id, user, dto.join_code);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Iniciar uma sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({
    status: 200,
    description: 'Sessão iniciada com sucesso',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível iniciar a sessão',
  })
  @ApiResponse({
    status: 404,
    description: 'Sessão não encontrada',
  })
  async startSession(@Param('id') id: string) {
    return this.sessionService.startSession(id);
  }

  // ===== ENDPOINTS DE MEMBROS =====

  @Post('members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar um membro à sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Membro adicionado com sucesso',
    type: SessionMemberResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Apenas o criador da sessão pode adicionar membros' 
  })
  @ApiBody({ type: CreateSessionMemberDto })
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
  @ApiOperation({ summary: 'Listar membros de uma sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de membros da sessão',
    type: [SessionMemberResponseDto]
  })
  async getSessionMembers(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto[]> {
    // Verificar se o usuário tem acesso à sessão
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.findAllBySession(sessionId);
  }

  @Get('my/memberships')
  @ApiOperation({ summary: 'Listar membros do usuário logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de membros do usuário',
    type: [SessionMemberResponseDto]
  })
  async getMyMemberships(@CurrentUser() user: User): Promise<SessionMemberResponseDto[]> {
    return this.sessionMemberService.findAllByUser(user.id);
  }

  @Get(':id/members/:memberId')
  @ApiOperation({ summary: 'Obter detalhes de um membro específico' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes do membro',
    type: SessionMemberResponseDto
  })
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
  @ApiOperation({ summary: 'Obter membro por ID do usuário' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes do membro',
    type: SessionMemberResponseDto
  })
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
  @ApiOperation({ summary: 'Atualizar um membro da sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ 
    status: 200, 
    description: 'Membro atualizado com sucesso',
    type: SessionMemberResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Apenas o criador da sessão pode atualizar membros' 
  })
  @ApiBody({ type: UpdateSessionMemberDto })
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
  @ApiOperation({ summary: 'Remover um membro da sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ 
    status: 204, 
    description: 'Membro removido com sucesso' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Apenas o criador da sessão pode remover membros' 
  })
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
  @ApiOperation({ summary: 'Entrar na sessão como membro' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Entrou na sessão como membro com sucesso',
    type: SessionMemberResponseDto
  })
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
  @ApiOperation({ summary: 'Sair da sessão como membro' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Saiu da sessão com sucesso',
    type: SessionMemberResponseDto
  })
  async leaveAsMember(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionMemberResponseDto> {
    // Verificar se a sessão existe e se o usuário pode acessá-la
    await this.sessionService.findById(sessionId, user);
    return this.sessionMemberService.leaveSession(sessionId, user.id);
  }

  @Get(':id/members/count/active')
  @ApiOperation({ summary: 'Obter contagem de membros ativos' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem de membros ativos',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 5
        }
      }
    }
  })
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
  @ApiOperation({ summary: 'Obter contagem de jogadores ativos' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem de jogadores ativos',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 4
        }
      }
    }
  })
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
  @ApiOperation({ summary: 'Listar mensagens de uma sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiQuery({ name: 'chat_type', required: false, enum: ['general', 'master'] })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de mensagens da sessão',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MessageResponseDto' }
        },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 5 },
        totalItems: { type: 'number', example: 100 },
        itemsPerPage: { type: 'number', example: 20 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  async getMessages(
    @Param('id') sessionId: string,
    @Query() query: GetMessagesQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResponseDto<MessageResponseDto>> {
    return this.messageService.findAll(sessionId, user.id, query);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar uma mensagem na sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Mensagem enviada com sucesso',
    type: MessageResponseDto
  })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(
    @Param('id') sessionId: string,
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.create(sessionId, createMessageDto, user.id);
  }

  @Get('messages/:messageId')
  @ApiOperation({ summary: 'Obter uma mensagem específica' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes da mensagem',
    type: MessageResponseDto
  })
  async getMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.findOne(messageId, user.id);
  }

  @Put('messages/:messageId')
  @ApiOperation({ summary: 'Atualizar uma mensagem' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mensagem atualizada com sucesso',
    type: MessageResponseDto
  })
  @ApiBody({ type: UpdateMessageDto })
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.messageService.update(messageId, updateMessageDto, user.id);
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma mensagem' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem' })
  @ApiResponse({ 
    status: 204, 
    description: 'Mensagem excluída com sucesso' 
  })
  async deleteMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.messageService.delete(messageId, user.id);
  }

  @Get(':id/messages/count')
  @ApiOperation({ summary: 'Obter contagem de mensagens da sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem de mensagens',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 150
        }
      }
    }
  })
  async getMessageCount(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return this.messageService.getMessageCount(sessionId, user.id);
  }

  // ===== ENDPOINTS DE NOTAS =====

  @Get(':id/notes')
  @ApiOperation({ summary: 'Listar notas de uma sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'include_private', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de notas da sessão',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/NoteResponseDto' }
        },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 3 },
        totalItems: { type: 'number', example: 50 },
        itemsPerPage: { type: 'number', example: 20 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  async getNotes(
    @Param('id') sessionId: string,
    @Query() query: GetNotesQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResponseDto<NoteResponseDto>> {
    return this.noteService.findAll(sessionId, user.id, query);
  }

  @Post(':id/notes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova nota na sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Nota criada com sucesso',
    type: NoteResponseDto
  })
  @ApiBody({ type: CreateNoteDto })
  async createNote(
    @Param('id') sessionId: string,
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.create(sessionId, createNoteDto, user.id);
  }

  @Get('notes/:noteId')
  @ApiOperation({ summary: 'Obter uma nota específica' })
  @ApiParam({ name: 'noteId', description: 'ID da nota' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes da nota',
    type: NoteResponseDto
  })
  async getNote(
    @Param('noteId') noteId: string,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.findOne(noteId, user.id);
  }

  @Put('notes/:noteId')
  @ApiOperation({ summary: 'Atualizar uma nota' })
  @ApiParam({ name: 'noteId', description: 'ID da nota' })
  @ApiResponse({ 
    status: 200, 
    description: 'Nota atualizada com sucesso',
    type: NoteResponseDto
  })
  @ApiBody({ type: UpdateNoteDto })
  async updateNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.update(noteId, updateNoteDto, user.id);
  }

  @Delete('notes/:noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma nota' })
  @ApiParam({ name: 'noteId', description: 'ID da nota' })
  @ApiResponse({ 
    status: 204, 
    description: 'Nota excluída com sucesso' 
  })
  async deleteNote(
    @Param('noteId') noteId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.noteService.delete(noteId, user.id);
  }

  @Get(':id/notes/count')
  @ApiOperation({ summary: 'Obter contagem de notas da sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem de notas',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 25
        }
      }
    }
  })
  async getNoteCount(
    @Param('id') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return this.noteService.getNoteCount(sessionId, user.id);
  }
} 