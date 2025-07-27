import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  email: z.string().email(),
  avatar: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
