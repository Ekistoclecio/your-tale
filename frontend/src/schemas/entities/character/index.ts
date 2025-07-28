import { z } from 'zod';

export const manaSchema = z.object({
  current: z.number(),
  maximum: z.number(),
});

export const hitPointsSchema = z.object({
  current: z.number(),
  maximum: z.number(),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.object({
    hitPoints: hitPointsSchema,
    mana: manaSchema,
    level: z.number(),
  }),
  character_sheet: z.looseObject({}),
  is_active: z.boolean(),
  character_class: z.string(),
  user_id: z.string(),
  session_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Character = z.infer<typeof characterSchema>;
