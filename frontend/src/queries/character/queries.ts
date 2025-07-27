import { useQuery } from '@tanstack/react-query';
import { characterService } from '@/services/characters';

export const useSessionCharactersQuery = (id: string) => {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: () => characterService.getSessionCharacters(id),
  });
};