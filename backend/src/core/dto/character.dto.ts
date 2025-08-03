import { IsString, IsOptional, IsObject, IsBoolean, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'Nome do personagem',
    example: 'Gandalf'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID da sessão onde o personagem será criado',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  session_id: string;

  @ApiPropertyOptional({
    description: 'Status atual do personagem (vida, mana, etc.)',
    example: { hp: 100, max_hp: 100, mana: 50, max_mana: 50 }
  })
  @IsOptional()
  @IsObject()
  status?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Ficha completa do personagem',
    example: { 
      race: 'Human', 
      class: 'Wizard', 
      level: 5, 
      attributes: { str: 10, dex: 14, con: 12, int: 18, wis: 16, cha: 12 } 
    }
  })
  @IsOptional()
  @IsObject()
  character_sheet?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Classe do personagem',
    example: 'Wizard'
  })
  @IsOptional()
  @IsString()
  character_class?: string;
}

export class UpdateCharacterStatusDto {
  @ApiProperty({
    description: 'Novo status do personagem',
    example: { hp: 85, max_hp: 100, mana: 30, max_mana: 50 }
  })
  @IsObject()
  status: Record<string, any>;
}

export class UpdateCharacterDto {
  @ApiPropertyOptional({
    description: 'Nome do personagem',
    example: 'Gandalf, o Cinzento'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Status atual do personagem',
    example: { hp: 85, max_hp: 100, mana: 30, max_mana: 50 }
  })
  @IsOptional()
  @IsObject()
  status?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Ficha completa do personagem',
    example: { 
      race: 'Human', 
      class: 'Wizard', 
      level: 6, 
      attributes: { str: 10, dex: 14, con: 12, int: 18, wis: 16, cha: 12 } 
    }
  })
  @IsOptional()
  @IsObject()
  character_sheet?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Se o personagem está ativo na sessão',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Classe do personagem',
    example: 'Wizard'
  })
  @IsOptional()
  @IsString()
  character_class?: string;
} 

export class CharacterValidationErrorDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'User does not have an active character in this session'
  })
  message: string;

  @ApiProperty({
    description: 'Indica se o usuário é o mestre da sessão',
    example: false
  })
  isMaster: boolean;

  @ApiProperty({
    description: 'Código de erro',
    example: 'CHARACTER_NOT_FOUND'
  })
  errorCode: string;
} 