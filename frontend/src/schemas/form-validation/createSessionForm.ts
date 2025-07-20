import { z } from 'zod';

export const createSessionSchema = z
  .object({
    title: z
      .string()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(60, 'O título deve ter no máximo 60 caracteres'),
    description: z
      .string()
      .min(10, 'A descrição deve ter pelo menos 10 caracteres')
      .max(500, 'A descrição deve ter no máximo 500 caracteres'),
    isPublic: z.boolean(),
    allowNewPlayersAfterStart: z.boolean(),
    playerLimit: z.number().min(2, 'Mínimo de 2 jogadores').max(10, 'Máximo de 10 jogadores'),
    masterType: z.enum(['human', 'ai']),
    // Campos condicionais para mestre IA
    aiTheme: z.string().optional(),
    aiNarrativeStyle: z.string().optional(),
    aiCampaignDescription: z.string().optional(),
    startDate: z.date().optional(),
  })
  .refine(
    (data) => {
      // Se o mestre for IA, os campos específicos são obrigatórios
      if (data.masterType === 'ai') {
        return data.aiTheme && data.aiNarrativeStyle && data.aiCampaignDescription;
      }
      return true;
    },
    {
      message: 'Para mestre IA, todos os campos de configuração são obrigatórios',
      path: ['aiTheme'],
    }
  );

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
