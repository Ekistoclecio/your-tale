import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../entities/character.entity';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { CreateCharacterDto, UpdateCharacterStatusDto, UpdateCharacterDto } from '../dto/character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(SessionMember)
    private sessionMemberRepository: Repository<SessionMember>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto, userId: string): Promise<Character> {
    // Validar que o usuário existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validar que a sessão existe
    const session = await this.sessionRepository.findOne({ where: { id: createCharacterDto.session_id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Validar que o usuário tem acesso à sessão
    const sessionMember = await this.sessionMemberRepository.findOne({
      where: { userId: userId, sessionId: createCharacterDto.session_id }
    });
    if (!sessionMember) {
      throw new ForbiddenException('User does not have access to this session');
    }

    // Validar que o nome é único por sessão
    const existingCharacter = await this.characterRepository.findOne({
      where: { name: createCharacterDto.name, session_id: createCharacterDto.session_id }
    });
    if (existingCharacter) {
      throw new BadRequestException('Character name already exists in this session');
    }

    // Verificar limite de personagens por usuário na sessão
    const userCharactersInSession = await this.characterRepository.count({
      where: { user_id: userId, session_id: createCharacterDto.session_id }
    });
    if (userCharactersInSession >= 3) { // Limite de 3 personagens por usuário por sessão
      throw new BadRequestException('Maximum number of characters per user in this session reached');
    }

    // Criar o personagem
    const character = this.characterRepository.create({
      ...createCharacterDto,
      user_id: userId,
    });

    return this.characterRepository.save(character);
  }

  async findOne(id: string, userId: string): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['user', 'session']
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Verificar acesso ao personagem (usuário deve ser dono ou ter acesso à sessão)
    if (character.user_id !== userId) {
      const sessionMember = await this.sessionMemberRepository.findOne({
        where: { userId: userId, sessionId: character.session_id }
      });
      if (!sessionMember) {
        throw new ForbiddenException('Access denied to this character');
      }
    }

    return character;
  }

  async updateStatus(id: string, updateStatusDto: UpdateCharacterStatusDto, userId: string): Promise<Character> {
    const character = await this.findOne(id, userId);

    // Verificar propriedade do personagem
    if (character.user_id !== userId) {
      throw new ForbiddenException('Only the character owner can update its status');
    }

    // Validar formato do JSON de status
    if (typeof updateStatusDto.status !== 'object' || updateStatusDto.status === null) {
      throw new BadRequestException('Status must be a valid JSON object');
    }

    // Atualizar o status
    character.status = updateStatusDto.status;
    return this.characterRepository.save(character);
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto, userId: string): Promise<Character> {
    const character = await this.findOne(id, userId);

    // Verificar propriedade do personagem
    if (character.user_id !== userId) {
      throw new ForbiddenException('Only the character owner can update the character');
    }

    // Se o nome está sendo alterado, verificar se é único na sessão
    if (updateCharacterDto.name && updateCharacterDto.name !== character.name) {
      const existingCharacter = await this.characterRepository.findOne({
        where: { name: updateCharacterDto.name, session_id: character.session_id }
      });
      if (existingCharacter && existingCharacter.id !== id) {
        throw new BadRequestException('Character name already exists in this session');
      }
    }

    // Atualizar o personagem
    Object.assign(character, updateCharacterDto);
    return this.characterRepository.save(character);
  }

  async findBySession(sessionId: string, userId: string): Promise<Character[]> {
    // Verificar acesso à sessão
    const sessionMember = await this.sessionMemberRepository.findOne({
      where: { userId: userId, sessionId: sessionId }
    });
    if (!sessionMember) {
      throw new ForbiddenException('User does not have access to this session');
    }

    return this.characterRepository.find({
      where: { session_id: sessionId },
      relations: ['user']
    });
  }

  async findByUser(userId: string): Promise<Character[]> {
    return this.characterRepository.find({
      where: { user_id: userId },
      relations: ['session']
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const character = await this.findOne(id, userId);

    // Verificar propriedade do personagem
    if (character.user_id !== userId) {
      throw new ForbiddenException('Only the character owner can delete the character');
    }

    await this.characterRepository.remove(character);
  }

  async findAllBySession(sessionId: string): Promise<Character[]> {
    return this.characterRepository.find({
      where: { session_id: sessionId },
      relations: ['user']
    });
  }
} 
