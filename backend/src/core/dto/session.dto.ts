import { IsString, IsBoolean, IsInt, IsOptional, IsDateString, IsEnum, Min, ValidateIf, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../entities/session.entity';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Título da sessão de RPG',
    example: 'Aventura na Floresta Encantada'
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da sessão',
    example: 'Uma jornada épica através de uma floresta mágica cheia de criaturas misteriosas'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Se a sessão é pública e pode ser encontrada por outros usuários',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @ApiPropertyOptional({
    description: 'Se jogadores podem entrar na sessão após ela ter começado',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  join_after_start?: boolean;

  @ApiProperty({
    description: 'Número máximo de jogadores permitidos na sessão',
    example: 6,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  player_limit: number;

  @ApiPropertyOptional({
    description: 'Se a sessão usa um mestre de jogo controlado por IA',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  is_ai_master?: boolean;

  @ApiProperty({
    description: 'Data e hora de início da sessão (formato ISO)',
    example: '2024-01-15T19:00:00.000Z'
  })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({
    description: 'Configurações adicionais da sessão',
    example: { theme: 'fantasy', difficulty: 'medium' }
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Tema do histórico da sessão',
    example: 'Fantasia medieval'
  })
  @IsOptional()
  @IsString()
  history_theme?: string;

  @ApiPropertyOptional({
    description: 'Descrição do histórico da sessão',
    example: 'Uma história épica de heróis em busca de um artefato perdido'
  })
  @IsOptional()
  @IsString()
  history_description?: string;

  @ApiPropertyOptional({
    description: 'Estilo narrativo da sessão',
    example: 'Dramático e detalhado'
  })
  @IsOptional()
  @IsString()
  narrative_style?: string;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({
    description: 'Título da sessão de RPG',
    example: 'Aventura na Floresta Encantada'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da sessão',
    example: 'Uma jornada épica através de uma floresta mágica cheia de criaturas misteriosas'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Se a sessão é pública e pode ser encontrada por outros usuários',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @ApiPropertyOptional({
    description: 'Se jogadores podem entrar na sessão após ela ter começado',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  join_after_start?: boolean;

  @ApiPropertyOptional({
    description: 'Número máximo de jogadores permitidos na sessão',
    example: 6,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  player_limit?: number;

  @ApiPropertyOptional({
    description: 'Se a sessão usa um mestre de jogo controlado por IA',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  is_ai_master?: boolean;

  @ApiPropertyOptional({
    description: 'Data e hora de início da sessão (formato ISO)',
    example: '2024-01-15T19:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Status atual da sessão',
    enum: SessionStatus,
    example: SessionStatus.NOT_STARTED
  })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'Configurações adicionais da sessão',
    example: { theme: 'fantasy', difficulty: 'medium' }
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Tema do histórico da sessão',
    example: 'Fantasia medieval'
  })
  @IsOptional()
  @IsString()
  history_theme?: string;

  @ApiPropertyOptional({
    description: 'Descrição do histórico da sessão',
    example: 'Uma história épica de heróis em busca de um artefato perdido'
  })
  @IsOptional()
  @IsString()
  history_description?: string;

  @ApiPropertyOptional({
    description: 'Estilo narrativo da sessão',
    example: 'Dramático e detalhado'
  })
  @IsOptional()
  @IsString()
  narrative_style?: string;
}

export class JoinSessionDto {
  @ApiProperty({
    description: 'Código de acesso para entrar na sessão',
    example: 'ABC123'
  })
  @IsString()
  join_code: string;
}

export class GetSessionsQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: '1'
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Número de sessões por página',
    example: '10'
  })
  @IsOptional()
  @IsString()
  limit?: string;
}

 