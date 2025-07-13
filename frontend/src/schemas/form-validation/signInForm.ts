import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Digite um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
