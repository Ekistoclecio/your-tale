import { useMutation } from '@tanstack/react-query';
import { characterService } from '@/services/characters';
import { queryClient } from '@/queries/client';

export const useUpdateCharacter = () => {
  return useMutation({
    mutationFn: characterService.updateCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};