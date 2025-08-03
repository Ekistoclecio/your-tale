import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services/users';

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: userService.update,
  });
};
