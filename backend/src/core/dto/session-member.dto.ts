import { IsUUID, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberRole, MemberStatus } from '../entities/session-member.entity';

export class CreateSessionMemberDto {
  @ApiProperty({
    description: 'ID da sessão',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  sessionId: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Papel do membro na sessão',
    enum: MemberRole,
    example: MemberRole.PLAYER
  })
  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;

  @ApiPropertyOptional({
    description: 'Status do membro na sessão',
    enum: MemberStatus,
    example: MemberStatus.ACTIVE
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiPropertyOptional({
    description: 'Data de entrada na sessão (formato ISO)',
    example: '2024-01-15T19:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  joined_at?: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais do membro',
    example: { character_name: 'Gandalf', character_class: 'Wizard' }
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateSessionMemberDto {
  @ApiPropertyOptional({
    description: 'Papel do membro na sessão',
    enum: MemberRole,
    example: MemberRole.PLAYER
  })
  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;

  @ApiPropertyOptional({
    description: 'Status do membro na sessão',
    enum: MemberStatus,
    example: MemberStatus.ACTIVE
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiPropertyOptional({
    description: 'Data de saída da sessão (formato ISO)',
    example: '2024-01-15T22:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  left_at?: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais do membro',
    example: { character_name: 'Gandalf', character_class: 'Wizard' }
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SessionMemberResponseDto {
  @ApiProperty({
    description: 'ID único do membro da sessão'
  })
  id: string;

  @ApiProperty({
    description: 'ID da sessão'
  })
  sessionId: string;

  @ApiProperty({
    description: 'ID do usuário'
  })
  userId: string;

  @ApiProperty({
    description: 'Papel do membro na sessão',
    enum: MemberRole
  })
  role: MemberRole;

  @ApiProperty({
    description: 'Status do membro na sessão',
    enum: MemberStatus
  })
  status: MemberStatus;

  @ApiPropertyOptional({
    description: 'Data de entrada na sessão'
  })
  joined_at?: Date;

  @ApiPropertyOptional({
    description: 'Data de saída da sessão'
  })
  left_at?: Date;

  @ApiPropertyOptional({
    description: 'Metadados adicionais do membro'
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Data de criação do registro'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização'
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Informações do usuário'
  })
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };

  @ApiPropertyOptional({
    description: 'Informações da sessão'
  })
  session?: {
    id: string;
    title: string;
    join_code: string;
    status: string;
  };
} 