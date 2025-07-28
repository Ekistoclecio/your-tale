import { useMutation } from '@tanstack/react-query';
import { sessionService } from '@/services/session';

export const useStartSession = () => {
  return useMutation({
    mutationFn: sessionService.startSession,
  });
};