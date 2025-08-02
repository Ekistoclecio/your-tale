import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { SignUpFormData } from '@/schemas/form-validation/signUpForm';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (user: Omit<SignUpFormData, 'confirmPassword'>) => authService.create(user),
  });
};