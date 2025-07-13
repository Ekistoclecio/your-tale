import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../entities/character.entity';
import { 
  CharacterResponseDto, 
  CharacterPrivateResponseDto, 
  CharacterListDto,
  CreateCharacterDto,
  UpdateCharacterDto 
} from '../../api/dto/character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  private mapUserToPublicDto(user: any): { id: string; name: string } {
    return {
      id: user.id,
      name: user.name,
    };
  }

  private mapUserToPrivateDto(user: any): { id: string; name: string; email: string } {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private mapCharacterToResponseDto(character: Character): CharacterResponseDto {
    return {
      id: character.id,
      playerId: character.playerId,
      attributes: character.attributes,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
      player: this.mapUserToPublicDto(character.player),
    };
  }

  private mapCharacterToPrivateResponseDto(character: Character): CharacterPrivateResponseDto {
    return {
      id: character.id,
      playerId: character.playerId,
      attributes: character.attributes,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
      player: this.mapUserToPrivateDto(character.player),
    };
  }

  private mapCharacterToListDto(character: Character): CharacterListDto {
    return {
      id: character.id,
      playerId: character.playerId,
      attributes: character.attributes,
      player: this.mapUserToPublicDto(character.player),
    };
  }

  async create(characterData: CreateCharacterDto): Promise<Character> {
    const character = this.charactersRepository.create({
      ...characterData,
      attributes: characterData.attributes || {},
    });
    return this.charactersRepository.save(character);
  }

  async findById(id: string): Promise<CharacterResponseDto | undefined> {
    const character = await this.charactersRepository.findOne({ 
      where: { id },
      relations: ['player']
    });
    
    if (!character) return undefined;
    
    return this.mapCharacterToResponseDto(character);
  }

  async findByIdPrivate(id: string): Promise<CharacterPrivateResponseDto | undefined> {
    const character = await this.charactersRepository.findOne({ 
      where: { id },
      relations: ['player']
    });
    
    if (!character) return undefined;
    
    return this.mapCharacterToPrivateResponseDto(character);
  }

  async findByPlayerId(playerId: string): Promise<CharacterListDto[]> {
    const characters = await this.charactersRepository.find({ 
      where: { playerId },
      relations: ['player']
    });
    
    return characters.map(character => this.mapCharacterToListDto(character));
  }

  async update(id: string, updateData: UpdateCharacterDto): Promise<CharacterResponseDto | undefined> {
    await this.charactersRepository.update(id, updateData);
    const character = await this.findById(id);
    return character || undefined;
  }

  async delete(id: string): Promise<void> {
    await this.charactersRepository.delete(id);
  }
} 