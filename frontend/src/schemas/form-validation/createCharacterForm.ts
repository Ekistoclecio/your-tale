import { z } from 'zod';

// Schema para atributos
export const attributeSchema = z.object({
  value: z.number().min(1).max(30),
  modifier: z.number().min(-5).max(10),
});

// Schema para estatísticas de combate
export const combatStatsSchema = z.object({
  armorClass: z.number().min(1).max(50),
  initiative: z.number().min(-10).max(20),
  speed: z.number().min(0).max(200),
  hitPoints: z.object({
    maximum: z.number().min(1),
    current: z.number().min(0),
    temporary: z.number().min(0),
  }),
  hitDice: z.string().optional(),
  resistances: z.array(z.string()).optional(),
});

// Schema para moedas
export const coinsSchema = z.object({
  copper: z.number().min(0),
  silver: z.number().min(0),
  electrum: z.number().min(0),
  gold: z.number().min(0),
  platinum: z.number().min(0),
});

// Schema para ataques
export const attackSchema = z.object({
  name: z.string().min(1),
  bonus: z.number(),
  damage: z.string(),
  type: z.string(),
  damageType: z.string().optional(),
  range: z.string().optional(),
  notes: z.string().optional(),
});

// Schema para magias
export const spellSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(9),
  school: z.string(),
  prepared: z.boolean().optional(),
  castingTime: z.string().optional(),
  range: z.string().optional(),
  components: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
});

// Schema principal do personagem
export const createCharacterSchema = z.object({
  // Identidade
  name: z.string().min(1, 'O nome é obrigatório').max(50),
  class: z.string().min(1, 'A classe é obrigatória'),
  race: z.string().min(1, 'A raça é obrigatória'),
  alignment: z.string().min(1, 'O alinhamento é obrigatório'),
  background: z.string().min(1, 'O antecedente é obrigatório'),
  playerName: z.string().min(1, 'O nome do jogador é obrigatório'),
  experiencePoints: z.number().min(0),
  level: z.number().min(1).max(20),

  // Atributos
  attributes: z.object({
    strength: attributeSchema,
    dexterity: attributeSchema,
    constitution: attributeSchema,
    intelligence: attributeSchema,
    wisdom: attributeSchema,
    charisma: attributeSchema,
  }),

  // Estatísticas de combate
  combatStats: combatStatsSchema,

  // Perícias e resistências
  skills: z.record(z.string(), z.boolean()).optional(),
  savingThrows: z.record(z.string(), z.boolean()).optional(),

  // Ataques e magias
  attacks: z.array(attackSchema),
  spells: z.array(spellSchema),
  spellSlots: z.record(z.string(), z.number()).optional(),

  // Inventário
  coins: coinsSchema,
  equipment: z.string().optional(),
  weight: z.number().min(0).optional(),
  carryingCapacity: z.number().min(0).optional(),
  magicItems: z.string().optional(),
  treasures: z.string().optional(),
  inventoryNotes: z.string().optional(),

  // Habilidades e características
  racialTraits: z.string().optional(),
  classFeatures: z.string().optional(),
  feats: z.string().optional(),
  specialAbilities: z.string().optional(),
  conditions: z.string().optional(),
  traitsNotes: z.string().optional(),

  // Aparência e história
  appearance: z.object({
    age: z.number().min(1).optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    eyes: z.string().optional(),
    skin: z.string().optional(),
    hair: z.string().optional(),
    distinguishingFeatures: z.string().optional(),
    clothing: z.string().optional(),
    description: z.string().optional(),
  }),
  backstory: z.string().optional(),
  personality: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type CreateCharacterFormData = z.infer<typeof createCharacterSchema>;

// Tipos auxiliares
export type AttributeKey = keyof CreateCharacterFormData['attributes'];
export type CoinType = keyof CreateCharacterFormData['coins'];
