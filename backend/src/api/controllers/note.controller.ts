import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { NoteService } from '../../core/providers/note.service';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto, GetNotesQueryDto } from '../../core/dto/note.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { User } from '../../core/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('sessions/:sessionId/notes')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  @Get()
  async getNotes(
    @Param('sessionId') sessionId: string,
    @Query() query: GetNotesQueryDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto[]> {
    return this.noteService.findAll(sessionId, user.id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNote(
    @Param('sessionId') sessionId: string,
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.create(sessionId, createNoteDto, user.id);
  }

  @Get(':id')
  async getNote(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.findOne(id, user.id);
  }

  @Patch(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User,
  ): Promise<NoteResponseDto> {
    return this.noteService.update(id, updateNoteDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.noteService.delete(id, user.id);
  }

  @Get('count/total')
  async getNoteCount(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return this.noteService.getNoteCount(sessionId, user.id);
  }
} 