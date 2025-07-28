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
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
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
  CreateCharacterFormData,
} from '@/schemas/form-validation/createCharacterForm';
import { StatusAndConditionsManager } from '@/components/molecules/StatusAndConditionsManager';

// ✅ Importação dos estilos refatorados
import * as S from './styles';
import { Character } from '@/schemas/entities/character';

// Interface para o personagem

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
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['identity']));
  const canEdit = userRole === 'master' || character?.user_id === currentUserId;

  // Converte Character -> FormData
  const convertCharacterToFormData = (char: Character): CreateCharacterFormData => ({
    name: char.name,
    class: char.character_class,
    race: char.character_sheet.race as string,
    alignment: char.character_sheet.alignment as string,
    background: char.character_sheet.background as string,
    playerName: char.character_sheet.playerName as string,
    experiencePoints: char.character_sheet.experiencePoints as number,
    level: char.status.level as number,
    // @ts-expect-error - TODO: fix this
    attributes: char.character_sheet.attributes as { [key: string]: { value: number; modifier: number } },
    // @ts-expect-error - TODO: fix this
    combatStats: char.character_sheet.combatStats as { [key: string]: number | { [key: string]: number } | string[] },
    // @ts-expect-error - TODO: fix this
    skills: char.character_sheet.skills as { [key: string]: string },
    // @ts-expect-error - TODO: fix this
    savingThrows: char.character_sheet.savingThrows as { [key: string]: string },
    // @ts-expect-error - TODO: fix this
    attacks: char.character_sheet.attacks as  { [key: string]: number | string }[] ,
    // @ts-expect-error - TODO: fix this
    spells: char.character_sheet.spells as { [key: string]: string }[],
    coins: char.character_sheet.coins as { copper: number; silver: number; electrum: number; gold: number; platinum: number },
    equipment: char.character_sheet.equipment as string,
    weight: char.character_sheet.weight as number,
    carryingCapacity: char.character_sheet.carryingCapacity as number,
    magicItems: char.character_sheet.magicItems as string,
    treasures: char.character_sheet.treasures as string,
    inventoryNotes: char.character_sheet.inventoryNotes as string,
    racialTraits: char.character_sheet.racialTraits as string,
    classFeatures: char.character_sheet.classFeatures as string,
    feats: char.character_sheet.feats as string,
    specialAbilities: char.character_sheet.specialAbilities as string,
    conditions: ((Array.isArray(char.character_sheet.conditions) ? char.character_sheet.conditions.join(' ') : char.character_sheet.conditions) || '') as string,
    traitsNotes: char.character_sheet.traitsNotes as string,  
    appearance: char.character_sheet.appearance as { age?: number | undefined; height?: string | undefined; weight?: string | undefined; eyes?: string | undefined; skin?: string | undefined; hair?: string | undefined; distinguishingFeatures?: string | undefined; clothing?: string | undefined; description?: string | undefined; },
    backstory: char.character_sheet.backstory as string,
    personality: char.character_sheet.personality as string,
    ideals: char.character_sheet.ideals as string,
    bonds: char.character_sheet.bonds as string,
    flaws: char.character_sheet.flaws as string,
    additionalNotes: char.character_sheet.additionalNotes as string,
  });

  // Converte FormData -> Character
  const convertFormDataToCharacter = (
    formData: CreateCharacterFormData,
    originalChar: Character
  ): Character => {
    // @ts-expect-error - TODO: fix this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, user, session_id, ...rest } = originalChar;
    return {
    ...rest,
    name: formData.name,
    character_class: formData.class,
    character_sheet: {
      ...originalChar.character_sheet,
      ...formData,
      conditions: ((Array.isArray(formData.conditions) ? formData.conditions.join(' ') : formData.conditions) || '') as string,
    },
    status: originalChar.status,
  } as unknown as Character;
}

  const form = useForm<CreateCharacterFormData>({
    defaultValues: character ? convertCharacterToFormData(character) : undefined,
  });

  const {
    handleSubmit,
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
      setIsLoading(true);
      const updatedCharacter = convertFormDataToCharacter(formData, character);
      onSave(updatedCharacter);
      setIsLoading(false);
    }
  });

  const handleCancel = () => {
    if (character) reset(convertCharacterToFormData(character));
    onClose();
  };

  // Gerenciamento de condições
  const handleAddCondition = (condition: string) => {
    const conditions = ((Array.isArray(character?.character_sheet.conditions) ? character?.character_sheet.conditions.join(' ') : character?.character_sheet.conditions) || '') as string;
    if (character && condition.trim() && !conditions.includes(condition.trim())) {
      setIsLoading(true);
      onSave({ ...character, character_sheet: { ...character.character_sheet, conditions: [...conditions, condition.trim()] } });
      setIsLoading(false);
    }
  };

  const handleRemoveCondition = (condition: string) => {
    if (character) {
      const conditions = ((Array.isArray(character.character_sheet.conditions) ? character.character_sheet.conditions.join(' ') : character.character_sheet.conditions) || '') as string;
      setIsLoading(true);
      onSave({ ...character, character_sheet: { ...character.character_sheet, conditions: conditions.split(' ').filter((c) => c !== condition) } });
      setIsLoading(false);
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
                        src={character.character_sheet.avatar as string | undefined}
                        alt={character.name}
                        sx={{ width: 80, height: 80 }}
                      />
                    </S.CharacterAvatar>

                    <S.CharacterInfo>
                      <Box>
                        <S.CharacterName>{character.name}</S.CharacterName>
                        <Typography variant="subtitle1" color="text.secondary">
                          {character.character_class as string} {character.character_sheet.race as string} • Nível {character.status.level as number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jogador: {character.character_sheet.playerName as string}
                        </Typography>
                      </Box>

                      {/* HP / Mana */}
                      <S.BasicInfoGrid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            size="small"
                            label="HP Atual"
                            type="number"
                            value={character.status.hitPoints.current as number}
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
                            value={character.status.hitPoints.maximum as number}
                            disabled={!canEdit}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                              },
                            }}
                          />
                        </Grid>
                        {Boolean(character.status.mana) && (
                          <>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <TextField
                                size="small"
                                label="Mana Atual"
                                type="number"
                                value={character.status.mana.current as number}
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
                                value={character.status.mana.maximum as number}
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
                                conditions={character.character_sheet.conditions as string[]}
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
                          disabled={isLoading}
                          startIcon={!isLoading ? <SaveIcon /> : undefined}
                          type="submit"
                        >
                          {isLoading ? <CircularProgress size={20} /> : 'Salvar Alterações'}
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
    </>
  );
};
