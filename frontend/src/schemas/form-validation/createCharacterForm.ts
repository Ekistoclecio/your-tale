import { z } from 'zod';

export const createCharacterSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  character_class: z.string().min(1, 'A classe é obrigatória'),

  status: z
    .object({
      hitPoints: z.object({
        maximum: z.number(),
        current: z.number(),
        temporary: z.number(),
      }),
      experiencePoints: z.number(),
      level: z.number(),
    })
    .catchall(z.any()),

  character_sheet: z.record(z.any(), z.any()),
});

export type CreateCharacterFormData = z.infer<typeof createCharacterSchema>;
