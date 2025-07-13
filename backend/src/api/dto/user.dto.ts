// DTOs para User - Versões específicas para diferentes contextos

// DTO para resposta pública (sem dados sensíveis)
export class UserPublicDto {
  id: string;
  name: string;
}

// DTO para resposta privada (com email, apenas para o próprio usuário)
export class UserPrivateDto {
  id: string;
  name: string;
  email: string;
}

// DTO para resposta completa (apenas para admin ou contexto específico)
export class UserDto {
  id: string;
  name: string;
  email: string;
}

// DTO para atualização de usuário
export class UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
}

// DTO para resposta de usuário com dados completos (sem senha)
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credit: number;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionPlayerDto {
  id: string;
  sessionId: string;
  playerId: string;
  characterId?: string;
  isMaster: boolean;
  createdAt: Date;
  updatedAt: Date;
  player: UserPublicDto; // Mudança para usar DTO público
  character?: any;
} 