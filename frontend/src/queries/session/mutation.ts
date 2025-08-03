import { useMutation } from '@tanstack/react-query';
import { sessionService } from '@/services/session';
import { queryClient } from '@/queries/client';

export const useCreateSession = () => {
  return useMutation({
    mutationFn: sessionService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useStartSession = () => {
  return useMutation({
    mutationFn: sessionService.startSession,
  });
};
