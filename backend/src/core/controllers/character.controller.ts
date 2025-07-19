import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CharacterService } from '../providers/character.service';
import { CreateCharacterDto, UpdateCharacterStatusDto, UpdateCharacterDto } from '../dto/character.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Character } from '../entities/character.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('characters')
@ApiBearerAuth('JWT-auth')
@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo personagem' })
  @ApiResponse({ 
    status: 201, 
    description: 'Personagem criado com sucesso',
    type: Character
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos' 
  })
  @ApiBody({ type: CreateCharacterDto })
  async create(@Body() createCharacterDto: CreateCharacterDto, @CurrentUser() user: User): Promise<Character> {
    return this.characterService.create(createCharacterDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um personagem específico' })
  @ApiParam({ name: 'id', description: 'ID do personagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes do personagem',
    type: Character
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Personagem não encontrado' 
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Character> {
    return this.characterService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status de um personagem' })
  @ApiParam({ name: 'id', description: 'ID do personagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status atualizado com sucesso',
    type: Character
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Personagem não encontrado' 
  })
  @ApiBody({ type: UpdateCharacterStatusDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateCharacterStatusDto,
    @CurrentUser() user: User,
  ): Promise<Character> {
    return this.characterService.updateStatus(id, updateStatusDto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um personagem' })
  @ApiParam({ name: 'id', description: 'ID do personagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Personagem atualizado com sucesso',
    type: Character
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Personagem não encontrado' 
  })
  @ApiBody({ type: UpdateCharacterDto })
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @CurrentUser() user: User,
  ): Promise<Character> {
    return this.characterService.update(id, updateCharacterDto, user.id);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Listar personagens de uma sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de personagens da sessão',
    type: [Character]
  })
  async findBySession(@Param('sessionId') sessionId: string, @CurrentUser() user: User): Promise<Character[]> {
    return this.characterService.findBySession(sessionId, user.id);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Listar personagens do usuário logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de personagens do usuário',
    type: [Character]
  })
  async findByUser(@CurrentUser() user: User): Promise<Character[]> {
    return this.characterService.findByUser(user.id);
  }

  @Post(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um personagem' })
  @ApiParam({ name: 'id', description: 'ID do personagem' })
  @ApiResponse({ 
    status: 204, 
    description: 'Personagem excluído com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Personagem não encontrado' 
  })
  async delete(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.characterService.delete(id, user.id);
  }
} 