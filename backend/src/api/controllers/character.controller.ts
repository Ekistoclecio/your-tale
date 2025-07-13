import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CharacterService } from '../../core/services/character.service';
import { Character } from 'src/core/entities/character.entity';
import { 
  CreateCharacterDto, 
  UpdateCharacterDto, 
  CharacterResponseDto, 
  CharacterPrivateResponseDto,
  CharacterListDto 
} from '../dto/character.dto';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() characterData: CreateCharacterDto): Promise<Character> {
    return await this.characterService.create(characterData);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CharacterResponseDto | undefined> {
    return await this.characterService.findById(id);
  }

  @Get(':id/private')
  async findByIdPrivate(@Param('id') id: string, @Request() req: any): Promise<CharacterPrivateResponseDto | undefined> {
    // TODO: Implementar validação de autorização para garantir que apenas o próprio player acesse
    // Por enquanto, retorna dados privados (com email)
    return await this.characterService.findByIdPrivate(id);
  }

  @Get('player/:playerId')
  async findByPlayerId(@Param('playerId') playerId: string): Promise<CharacterListDto[]> {
    return await this.characterService.findByPlayerId(playerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCharacterDto): Promise<CharacterResponseDto | undefined> {
    return await this.characterService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.characterService.delete(id);
  }
} 