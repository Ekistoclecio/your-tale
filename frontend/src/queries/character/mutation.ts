import { useMutation } from '@tanstack/react-query';
import { characterService } from '@/services/characters';
import { queryClient } from '@/queries/client';
import { sessionService } from '@/services/session';

export const useCreateCharacter = () => {
  return useMutation({
    mutationFn: characterService.createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useRegisterMember = () => {
  return useMutation({
    mutationFn: sessionService.registerMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpdateCharacter = () => {
  return useMutation({
    mutationFn: characterService.updateCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};
