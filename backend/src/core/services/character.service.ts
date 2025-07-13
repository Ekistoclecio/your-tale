import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../entities/character.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async create(characterData: { playerId: string; attributes?: Record<string, any> }): Promise<Character> {
    const character = this.charactersRepository.create({
      ...characterData,
      attributes: characterData.attributes || {},
    });
    return this.charactersRepository.save(character);
  }

  async findById(id: string): Promise<Character | undefined> {
    const character = await this.charactersRepository.findOne({ 
      where: { id },
      relations: ['player']
    });
    return character || undefined;
  }

  async findByPlayerId(playerId: string): Promise<Character[]> {
    return this.charactersRepository.find({ 
      where: { playerId },
      relations: ['player']
    });
  }

  async update(id: string, updateData: Partial<Character>): Promise<Character | undefined> {
    await this.charactersRepository.update(id, updateData);
    const character = await this.findById(id);
    return character || undefined;
  }

  async delete(id: string): Promise<void> {
    await this.charactersRepository.delete(id);
  }
} 