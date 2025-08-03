import { z } from 'zod';

export const createSessionSchema = z
  .object({
    title: z
      .string()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(60, 'O título deve ter no máximo 60 caracteres'),
    description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres'),
    is_public: z.boolean(),
    join_after_start: z.boolean(),
    player_limit: z.number().min(2, 'Mínimo de 2 jogadores').max(10, 'Máximo de 10 jogadores'),
    is_ai_master: z.boolean(),
    start_date: z.date().nullable().optional(),
    // Campos condicionais para mestre IA
    ai_theme: z.string().optional(),
    ai_narrative_style: z.string().optional(),
    ai_campaign_description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_ai_master) {
      if (!data.ai_theme || data.ai_theme.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O tema da IA é obrigatório e deve ter pelo menos 3 caracteres',
          path: ['ai_theme'],
        });
      }
      if (!data.ai_narrative_style || data.ai_narrative_style.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O estilo narrativo da IA é obrigatório',
          path: ['ai_narrative_style'],
        });
      }
      if (!data.ai_campaign_description || data.ai_campaign_description.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A descrição da campanha IA é obrigatória e deve ter pelo menos 10 caracteres',
          path: ['ai_campaign_description'],
        });
      }
    }
  });
export type CreateSessionFormData = z.infer<typeof createSessionSchema>;

export const narrativeStyles = [
  'Aventura',
  'Terror',
  'Mistério',
  'Intriga política',
  'Exploração',
  'Guerra',
  'Romance',
  'Comédia',
  'Drama',
  'Fantasia épica',
] as const;

export type NarrativeStyle = (typeof narrativeStyles)[number];
