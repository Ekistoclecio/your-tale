import { z } from 'zod';
import { userSchema } from '../user';

export const sessionSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  is_public: z.boolean(),
  is_ai_master: z.boolean(),
  status: z.enum(['not_started', 'active', 'ended']),
  join_code: z.string(),
  creator: userSchema.optional(),
  start_date: z.string().optional(),
  join_after_start: z.boolean(),
  current_players: z.number(),
  player_limit: z.number(),
});

export type Session = z.infer<typeof sessionSchema>;
