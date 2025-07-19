import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiPropertyOptional({
    description: 'Título da nota',
    example: 'Anotações da sessão'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: 'Conteúdo da nota',
    example: 'Esta é uma nota importante sobre a sessão de RPG...'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Se a nota é privada (só visível para o autor)',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  is_private?: boolean;

  @ApiPropertyOptional({
    description: 'Tags para categorizar a nota',
    example: ['importante', 'sessão1', 'npcs'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateNoteDto {
  @ApiPropertyOptional({
    description: 'Título da nota',
    example: 'Anotações da sessão atualizadas'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Conteúdo da nota',
    example: 'Esta é uma nota atualizada sobre a sessão de RPG...'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional({
    description: 'Se a nota é privada (só visível para o autor)',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  is_private?: boolean;

  @ApiPropertyOptional({
    description: 'Tags para categorizar a nota',
    example: ['importante', 'sessão1', 'npcs'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class NoteResponseDto {
  @ApiProperty({
    description: 'ID único da nota'
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Título da nota'
  })
  title: string | null;

  @ApiProperty({
    description: 'Conteúdo da nota'
  })
  content: string;

  @ApiProperty({
    description: 'Se a nota é privada'
  })
  is_private: boolean;

  @ApiPropertyOptional({
    description: 'Tags da nota',
    type: [String]
  })
  tags: string[] | null;

  @ApiProperty({
    description: 'ID da sessão onde a nota foi criada'
  })
  session_id: string;

  @ApiProperty({
    description: 'ID do autor da nota'
  })
  author_id: string;

  @ApiProperty({
    description: 'Data de criação da nota'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização da nota'
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Informações do autor da nota'
  })
  author?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export class GetNotesQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: '1'
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Número de notas por página',
    example: '10'
  })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Incluir notas privadas na busca',
    example: 'true'
  })
  @IsOptional()
  @IsBoolean()
  include_private?: string;

  @ApiPropertyOptional({
    description: 'Termo de busca para filtrar notas',
    example: 'sessão'
  })
  @IsOptional()
  @IsString()
  search?: string;
} 