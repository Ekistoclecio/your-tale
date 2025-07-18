import { IsUUID, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { MemberRole, MemberStatus } from '../entities/session-member.entity';

export class CreateSessionMemberDto {
  @IsUUID()
  sessionId: string;

  @IsUUID()
  userId: string;

  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @IsDateString()
  @IsOptional()
  joined_at?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateSessionMemberDto {
  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @IsDateString()
  @IsOptional()
  left_at?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SessionMemberResponseDto {
  id: string;
  sessionId: string;
  userId: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at?: Date;
  left_at?: Date;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  session?: {
    id: string;
    title: string;
    join_code: string;
    status: string;
  };
} 