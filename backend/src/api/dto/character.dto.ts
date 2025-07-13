// DTOs para Character - Versões específicas para diferentes contextos

// DTO para criação de personagem
export class CreateCharacterDto {
  playerId: string;
  attributes?: Record<string, any>;
}

// DTO para atualização de personagem
export class UpdateCharacterDto {
  attributes?: Record<string, any>;
}

// DTO para resposta pública (sem dados sensíveis do player)
export class CharacterResponseDto {
  id: string;
  playerId: string;
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  player: {
    id: string;
    name: string;
    // email removido por segurança
  };
}

// DTO para resposta privada (apenas para o próprio player)
export class CharacterPrivateResponseDto {
  id: string;
  playerId: string;
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  player: {
    id: string;
    name: string;
    email: string; // Apenas para o próprio player
  };
}

// DTO para listagem de personagens
export class CharacterListDto {
  id: string;
  playerId: string;
  attributes: Record<string, any>;
  player: {
    id: string;
    name: string;
  };
} 