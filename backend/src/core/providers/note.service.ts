import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Note } from '../entities/note.entity';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto, GetNotesQueryDto } from '../dto/note.dto';
import { MemberRole } from '../entities/session-member.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(SessionMember)
    private readonly sessionMemberRepository: Repository<SessionMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(sessionId: string, createNoteDto: CreateNoteDto, userId: string): Promise<NoteResponseDto> {
    // Verificar se a sessão existe
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session');
    }

    // Criar a nota
    const note = this.noteRepository.create({
      ...createNoteDto,
      session_id: sessionId,
      author_id: userId,
      is_private: createNoteDto.is_private || false,
      tags: createNoteDto.tags || null,
    });

    const savedNote = await this.noteRepository.save(note);

    return this.formatNoteResponse(savedNote);
  }

  async findAll(sessionId: string, userId: string, query: GetNotesQueryDto = {}): Promise<NoteResponseDto[]> {
    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId }, role: MemberRole.MASTER },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session notes');
    }

    // Construir query base
    let queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.author', 'author')
      .where('note.session_id = :sessionId', { sessionId })
      .orderBy('note.updated_at', 'DESC');

    // Filtrar por permissões (notas privadas vs públicas)
    const includePrivate = query.include_private === 'true';
    if (!includePrivate) {
      // Se não for master, mostrar apenas notas públicas ou próprias
      if (membership.role !== MemberRole.MASTER) {
        queryBuilder = queryBuilder.andWhere(
          '(note.is_private = :isPrivate OR note.author_id = :userId)',
          { isPrivate: false, userId }
        );
      }
    }

    // Busca por texto
    if (query.search) {
      queryBuilder = queryBuilder.andWhere(
        '(note.title LIKE :search OR note.content LIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Aplicar paginação
    const page = parseInt(query.page || '1') || 1;
    const limit = parseInt(query.limit || '50') || 50;
    const offset = (page - 1) * limit;

    queryBuilder = queryBuilder.skip(offset).take(limit);

    const notes = await queryBuilder.getMany();

    return notes.map(note => this.formatNoteResponse(note));
  }

  async findOne(id: string, userId: string): Promise<NoteResponseDto> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: note.session_id }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this note');
    }

    // Verificar permissão para notas privadas
    if (note.is_private && note.author_id !== userId && membership.role !== MemberRole.MASTER) {
      throw new ForbiddenException('Access denied to private note');
    }

    return this.formatNoteResponse(note);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<NoteResponseDto> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verificar se o usuário é o autor da nota ou master da sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: note.session_id }, user: { id: userId } },
    });

    if (!membership) {
      throw new ForbiddenException('User does not have access to this note');
    }

    const isAuthor = note.author_id === userId;
    const isMaster = membership.role === MemberRole.MASTER;

    if (!isAuthor && !isMaster) {
      throw new ForbiddenException('Only note author or session master can update the note');
    }

    // Atualizar a nota
    Object.assign(note, updateNoteDto);
    const updatedNote = await this.noteRepository.save(note);

    return this.formatNoteResponse(updatedNote);
  }

  async delete(id: string, userId: string): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verificar se o usuário é o autor da nota ou master da sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: note.session_id }, user: { id: userId } },
    });

    if (!membership) {
      throw new ForbiddenException('User does not have access to this note');
    }

    const isAuthor = note.author_id === userId;
    const isMaster = membership.role === MemberRole.MASTER;

    if (!isAuthor && !isMaster) {
      throw new ForbiddenException('Only note author or session master can delete the note');
    }

    await this.noteRepository.remove(note);
  }

  async getNoteCount(sessionId: string, userId: string): Promise<{ count: number }> {
    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session');
    }

    // Construir query base
    let queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .where('note.session_id = :sessionId', { sessionId });

    // Filtrar por permissões
    if (membership.role !== MemberRole.MASTER) {
      queryBuilder = queryBuilder.andWhere(
        '(note.is_private = :isPrivate OR note.author_id = :userId)',
        { isPrivate: false, userId }
      );
    }

    const count = await queryBuilder.getCount();
    return { count };
  }

  private formatNoteResponse(note: Note): NoteResponseDto {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      is_private: note.is_private,
      tags: note.tags,
      session_id: note.session_id,
      author_id: note.author_id,
      created_at: note.created_at,
      updated_at: note.updated_at,
      author: note.author ? {
        id: note.author.id,
        name: note.author.name,
        avatar: note.author.avatar,
      } : undefined,
    };
  }
} 