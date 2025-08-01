
import { Character } from '@/schemas/entities/character';
import { ApiService } from '@/services/client';

class CharacterService extends ApiService {
  constructor() {
    super('characters/');
  }

  getSessionCharacters = async (sessionId: string) => {
    const { data } = await this.get<Character[]>(`session/${sessionId}`);
    return data;
  };

  updateCharacter = async (character: Character) => {
    // @ts-expect-error - TODO: fix this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, user_id, user, session_id, ...rest } = character;
    const { data } = await this.patch<Character>(`${id}`, rest);
    return data;
  };
}

export const characterService = new CharacterService();
