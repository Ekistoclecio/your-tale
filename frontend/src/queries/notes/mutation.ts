import { useMutation } from '@tanstack/react-query';
import { sessionService } from '@/services/session';
import { queryClient } from '@/queries/client';
import { Note } from '@/schemas/entities/notes';

export const useCreateSessionNote = (sessionId: string) => {
  return useMutation({
    mutationFn: (data: Omit<Note, 'id'>) => sessionService.createSessionNote(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteSessionNote = () => {
  return useMutation({
    mutationFn: ({ noteId }: { noteId: string }) => sessionService.deleteSessionNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateSessionNote = () => {
  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: Omit<Note, 'id'> }) =>
      sessionService.updateSessionNote(noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
