import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RpgUtilsService } from '../providers/rpg-utils.service';
import { RollDiceDto, RollDiceResponseDto } from '../dto/rpg-utils.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('rpg-utils')
@ApiBearerAuth('JWT-auth')
@Controller('rpg-utils')
@UseGuards(JwtAuthGuard)
export class RpgUtilsController {
  constructor(private readonly rpgUtilsService: RpgUtilsService) {}

  @Post('roll-dice')
  @ApiOperation({ summary: 'Rolar um dado do tipo especificado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resultado da rolagem do dado',
    type: RollDiceResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Tipo de dado inválido fornecido' 
  })
  @ApiBody({ type: RollDiceDto })
  async rollDice(@Body() rollDiceDto: RollDiceDto): Promise<RollDiceResponseDto> {
    return this.rpgUtilsService.rollDice(rollDiceDto);
  }

  @Get('available-dice')
  @ApiOperation({ summary: 'Obter tipos de dados disponíveis' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tipos de dados suportados',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        example: 'd20'
      }
    }
  })
  async getAvailableDiceTypes(): Promise<string[]> {
    return this.rpgUtilsService.getAvailableDiceTypes();
  }
} 