import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CharacterService } from '../../core/services/character.service';
import { Character } from 'src/core/entities/character.entity';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() characterData: { playerId: string; attributes?: Record<string, any> }): Promise<Character> {
    return await this.characterService.create(characterData);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Character | undefined> {
    return await this.characterService.findById(id);
  }

  @Get('player/:playerId')
  async findByPlayerId(@Param('playerId') playerId: string): Promise<Character[]> {
    return await this.characterService.findByPlayerId(playerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Character>): Promise<Character | undefined> {
    return await this.characterService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.characterService.delete(id);
  }
} 