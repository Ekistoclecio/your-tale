'use client';

import {
  Box,
  Typography,
  AccordionDetails,
  Grid,
  TextField,
  IconButton,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CloseRounded as CloseIcon,
  SaveRounded as SaveIcon,
  CancelRounded as CancelIcon,
  ExpandMoreRounded,
  PersonRounded as PersonIcon,
  FlashOnRounded as FlashIcon,
  ShieldRounded as ShieldIcon,
  SchoolRounded as SchoolIcon,
  SportsMartialArtsRounded as SwordIcon,
  BackpackRounded as BackpackIcon,
  StarRounded as StarIcon,
  FaceRounded as FaceIcon,
  LocalHospitalRounded as StatusIcon,
} from '@mui/icons-material';

import { Avatar } from '@/components/atoms';
import {
  CharacterIdentityForm,
  AttributesForm,
  CombatStatsForm,
  SkillsAndSavesForm,
  AttacksAndSpellsForm,
  InventoryForm,
  TraitsAndAbilitiesForm,
  AppearanceAndBackstoryForm,
} from '@/components/organisms';
import {
  createCharacterSchema,
  CreateCharacterFormData,
} from '@/schemas/form-validation/createCharacterForm';
import { StatusAndConditionsManager } from '@/components/molecules/StatusAndConditionsManager';

// ✅ Importação dos estilos refatorados
import * as S from './styles';

// Interface para o personagem
interface Character {
  id: string;
  name: string;
  playerName: string;
  avatar?: string;
  level: number;
  class: string;
  race: string;
  alignment: string;
  background: string;
  experiencePoints: number;
  hp: { current: number; max: number };
  mana?: { current: number; max: number };
  status: 'alive' | 'unconscious' | 'dead';
  attributes: {
    strength: { value: number; modifier: number };
    dexterity: { value: number; modifier: number };
    constitution: { value: number; modifier: number };
    intelligence: { value: number; modifier: number };
    wisdom: { value: number; modifier: number };
    charisma: { value: number; modifier: number };
  };
  combatStats: {
    armorClass: number;
    initiative: number;
    speed: number;
    hitPoints: { maximum: number; current: number; temporary: number };
    hitDice?: string;
    resistances?: string[];
  };
  skills: {
    [key: string]: boolean;
  };
  savingThrows: {
    [key: string]: boolean;
  };
  attacks: {
    name: string;
    bonus: number;
    damage: string;
    type: string;
    damageType?: string | undefined;
    range?: string | undefined;
    notes?: string | undefined;
  }[];
  spells: {
    name: string;
    level: number;
    school: string;
    prepared?: boolean | undefined;
    castingTime?: string | undefined;
    range?: string | undefined;
    components?: string | undefined;
    duration?: string | undefined;
    description?: string | undefined;
  }[];
  coins: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
  equipment: string;
  weight: number;
  magicItems: string;
  treasures: string;
  inventoryNotes: string;
  racialTraits: string;
  classFeatures: string;
  feats: string;
  specialAbilities: string;
  conditions: string[];
  traitsNotes: string;
  appearance: {
    age?: number | undefined;
    height?: string | undefined;
    weight?: string | undefined;
    eyes?: string | undefined;
    skin?: string | undefined;
    hair?: string | undefined;
    distinguishingFeatures?: string | undefined;
    clothing?: string | undefined;
    description?: string | undefined;
  };
  backstory: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  additionalNotes: string;
  carryingCapacity: number;
}

interface CharacterModalProps {
  open: boolean;
  onClose: () => void;
  character: Character | null;
  currentUserId: string;
  userRole: 'player' | 'master';
  onSave: (character: Character) => void;
}

// Configuração das seções
const sections = [
  {
    id: 'identity',
    title: 'Identidade do Personagem',
    icon: PersonIcon,
    component: CharacterIdentityForm,
    defaultExpanded: true,
  },
  {
    id: 'attributes',
    title: 'Atributos',
    icon: FlashIcon,
    component: AttributesForm,
    defaultExpanded: false,
  },
  {
    id: 'combat',
    title: 'Estatísticas de Combate',
    icon: ShieldIcon,
    component: CombatStatsForm,
    defaultExpanded: false,
  },
  {
    id: 'status',
    title: 'Status e Condições',
    icon: StatusIcon,
    component: null,
    defaultExpanded: false,
  },
  {
    id: 'skills',
    title: 'Perícias e Resistências',
    icon: SchoolIcon,
    component: SkillsAndSavesForm,
    defaultExpanded: false,
  },
  {
    id: 'attacks',
    title: 'Ataques e Magias',
    icon: SwordIcon,
    component: AttacksAndSpellsForm,
    defaultExpanded: false,
  },
  {
    id: 'inventory',
    title: 'Inventário',
    icon: BackpackIcon,
    component: InventoryForm,
    defaultExpanded: false,
  },
  {
    id: 'traits',
    title: 'Características e Habilidades',
    icon: StarIcon,
    component: TraitsAndAbilitiesForm,
    defaultExpanded: false,
  },
  {
    id: 'appearance',
    title: 'Aparência e História',
    icon: FaceIcon,
    component: AppearanceAndBackstoryForm,
    defaultExpanded: false,
  },
];

export const CharacterModal = ({
  open,
  onClose,
  character,
  currentUserId,
  userRole,
  onSave,
}: CharacterModalProps) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['identity']));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const canEdit = userRole === 'master' || character?.id === currentUserId;

  // Converte Character -> FormData
  const convertCharacterToFormData = (char: Character): CreateCharacterFormData => ({
    name: char.name,
    class: char.class,
    race: char.race,
    alignment: char.alignment,
    background: char.background,
    playerName: char.playerName,
    experiencePoints: char.experiencePoints,
    level: char.level,
    attributes: char.attributes,
    combatStats: char.combatStats,
    skills: char.skills,
    savingThrows: char.savingThrows,
    attacks: char.attacks,
    spells: char.spells,
    coins: char.coins,
    equipment: char.equipment,
    weight: char.weight,
    carryingCapacity: char.carryingCapacity,
    magicItems: char.magicItems,
    treasures: char.treasures,
    inventoryNotes: char.inventoryNotes,
    racialTraits: char.racialTraits,
    classFeatures: char.classFeatures,
    feats: char.feats,
    specialAbilities: char.specialAbilities,
    conditions: Array.isArray(char.conditions) ? char.conditions.join('\n') : char.conditions || '',
    traitsNotes: char.traitsNotes,
    appearance: char.appearance,
    backstory: char.backstory,
    personality: char.personality,
    ideals: char.ideals,
    bonds: char.bonds,
    flaws: char.flaws,
    additionalNotes: char.additionalNotes,
  });

  // Converte FormData -> Character
  const convertFormDataToCharacter = (
    formData: CreateCharacterFormData,
    originalChar: Character
  ): Character => ({
    ...originalChar,
    ...formData,
    conditions: Array.isArray(originalChar.conditions)
      ? originalChar.conditions
      : formData?.conditions?.split('\n').filter((c) => c.trim()) || [],
    hp: originalChar.hp,
    mana: originalChar.mana,
    status: originalChar.status,
  });

  const form = useForm<CreateCharacterFormData>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: character ? convertCharacterToFormData(character) : undefined,
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = form;

  useEffect(() => {
    if (character) reset(convertCharacterToFormData(character));
  }, [character, reset]);

  const handleSectionToggle = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSave = handleSubmit((formData) => {
    if (character) {
      const updatedCharacter = convertFormDataToCharacter(formData, character);
      onSave(updatedCharacter);
      setSnackbar({ open: true, message: 'Personagem salvo com sucesso!', severity: 'success' });
    }
  });

  const handleCancel = () => {
    if (character) reset(convertCharacterToFormData(character));
    onClose();
  };

  // Gerenciamento de condições
  const handleAddCondition = (condition: string) => {
    if (character && condition.trim() && !character.conditions.includes(condition.trim())) {
      onSave({ ...character, conditions: [...character.conditions, condition.trim()] });
    }
  };

  const handleRemoveCondition = (condition: string) => {
    if (character) {
      onSave({ ...character, conditions: character.conditions.filter((c) => c !== condition) });
    }
  };

  if (!character) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <S.ModalContainer open={open} onClose={handleCancel}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <S.ModalContent>
                <FormProvider {...form}>
                  {/* Header */}
                  <S.Header>
                    <S.CharacterAvatar>
                      <Avatar
                        src={character.avatar}
                        alt={character.name}
                        sx={{ width: 80, height: 80 }}
                      />
                    </S.CharacterAvatar>

                    <S.CharacterInfo>
                      <Box>
                        <S.CharacterName>{character.name}</S.CharacterName>
                        <Typography variant="subtitle1" color="text.secondary">
                          {character.class} {character.race} • Nível {character.level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jogador: {character.playerName}
                        </Typography>
                      </Box>

                      {/* HP / Mana */}
                      <S.BasicInfoGrid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            size="small"
                            label="HP Atual"
                            type="number"
                            value={character.hp.current}
                            disabled={!canEdit}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            size="small"
                            label="HP Máximo"
                            type="number"
                            value={character.hp.max}
                            disabled={!canEdit}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                              },
                            }}
                          />
                        </Grid>
                        {character.mana && (
                          <>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <TextField
                                size="small"
                                label="Mana Atual"
                                type="number"
                                value={character.mana.current}
                                disabled={!canEdit}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.1),
                                  },
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <TextField
                                size="small"
                                label="Mana Máxima"
                                type="number"
                                value={character.mana.max}
                                disabled={!canEdit}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.1),
                                  },
                                }}
                              />
                            </Grid>
                          </>
                        )}
                      </S.BasicInfoGrid>
                    </S.CharacterInfo>

                    <IconButton
                      onClick={handleCancel}
                      sx={{
                        color: theme.palette.text.secondary,
                        alignSelf: 'flex-start',
                        '&:hover': {
                          color: theme.palette.error.main,
                          backgroundColor: `${theme.palette.error.main}10`,
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </S.Header>

                  {/* Content */}
                  <S.ContentContainer>
                    {sections.map((section) => {
                      const SectionComponent = section.component;
                      const SectionIcon = section.icon;

                      return (
                        <S.SectionContainer
                          key={section.id}
                          expanded={expandedSections.has(section.id)}
                          onChange={() => handleSectionToggle(section.id)}
                        >
                          <S.SectionHeader expandIcon={<ExpandMoreRounded />}>
                            <SectionIcon sx={{ mr: 1 }} />
                            <S.SectionTitle>{section.title}</S.SectionTitle>
                          </S.SectionHeader>
                          <AccordionDetails>
                            {section.id === 'status' ? (
                              <StatusAndConditionsManager
                                conditions={character.conditions}
                                onAddCondition={handleAddCondition}
                                onRemoveCondition={handleRemoveCondition}
                                canEdit={canEdit}
                              />
                            ) : SectionComponent ? (
                              <SectionComponent />
                            ) : null}
                          </AccordionDetails>
                        </S.SectionContainer>
                      );
                    })}
                  </S.ContentContainer>

                  {/* Footer */}
                  {canEdit && (
                    <S.Footer>
                      <Typography variant="caption" color="text.secondary">
                        {isDirty ? 'Há alterações não salvas' : 'Nenhuma alteração'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <S.CancelButton
                          variant="outlined"
                          onClick={handleCancel}
                          startIcon={<CancelIcon />}
                        >
                          Cancelar
                        </S.CancelButton>
                        <S.SaveButton
                          variant="contained"
                          onClick={handleSave}
                          disabled={!isDirty || !isValid}
                          startIcon={<SaveIcon />}
                        >
                          Salvar Alterações
                        </S.SaveButton>
                      </Box>
                    </S.Footer>
                  )}
                </FormProvider>
              </S.ModalContent>
            </motion.div>
          </S.ModalContainer>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: theme.shape.borderRadiusMedium }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
