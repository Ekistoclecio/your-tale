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
import { CharacterService } from '../providers/character.service';
import { CreateCharacterDto, UpdateCharacterStatusDto, UpdateCharacterDto } from '../dto/character.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Character } from '../entities/character.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() createCharacterDto: CreateCharacterDto, @CurrentUser() user: User): Promise<Character> {
    return this.characterService.create(createCharacterDto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Character> {
    return this.characterService.findOne(id, user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateCharacterStatusDto,
    @CurrentUser() user: User,
  ): Promise<Character> {
    return this.characterService.updateStatus(id, updateStatusDto, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @CurrentUser() user: User,
  ): Promise<Character> {
    return this.characterService.update(id, updateCharacterDto, user.id);
  }

  @Get('session/:sessionId')
  async findBySession(@Param('sessionId') sessionId: string, @CurrentUser() user: User): Promise<Character[]> {
    return this.characterService.findBySession(sessionId, user.id);
  }

  @Get('user/me')
  async findByUser(@CurrentUser() user: User): Promise<Character[]> {
    return this.characterService.findByUser(user.id);
  }

  @Post(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.characterService.delete(id, user.id);
  }
} 