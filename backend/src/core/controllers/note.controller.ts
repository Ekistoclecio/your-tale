import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NoteService } from '../providers/note.service';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto, GetNotesQueryDto } from '../dto/note.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sessions/:sessionId/notes')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar notas de uma sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'include_private', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de notas da sessão',
    type: [NoteResponseDto]
  })
  async getNotes(
    @Param('sessionId') sessionId: string,
    @Query() query: GetNotesQueryDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto[]> {
    return this.noteService.findAll(sessionId, user.id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova nota na sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Nota criada com sucesso',
    type: NoteResponseDto
  })
  @ApiBody({ type: CreateNoteDto })
  async createNote(
    @Param('sessionId') sessionId: string,
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.create(sessionId, createNoteDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma nota específica' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'id', description: 'ID da nota' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes da nota',
    type: NoteResponseDto
  })
  async getNote(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma nota' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'id', description: 'ID da nota' })
  @ApiResponse({ 
    status: 200, 
    description: 'Nota atualizada com sucesso',
    type: NoteResponseDto
  })
  @ApiBody({ type: UpdateNoteDto })
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.update(id, updateNoteDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma nota' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'id', description: 'ID da nota' })
  @ApiResponse({ 
    status: 204, 
    description: 'Nota excluída com sucesso' 
  })
  async deleteNote(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.noteService.delete(id, user.id);
  }

  @Get('count/total')
  @ApiOperation({ summary: 'Obter contagem total de notas da sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem total de notas',
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
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return this.noteService.getNoteCount(sessionId, user.id);
  }
} 