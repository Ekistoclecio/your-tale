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
import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { StatusAndConditionsManager } from '@/components/molecules/StatusAndConditionsManager';
import * as S from './styles';
import { Character } from '@/schemas/entities/character';

interface CharacterModalProps {
  open: boolean;
  onClose: () => void;
  character: Character | null;
  currentUserId: string;
  userRole: 'player' | 'master';
  onSave: (character: Character) => Promise<void> | void;
}

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

  // controla qual seção está expandida
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['identity']));
  // controla quais seções estão visíveis (para permitir animação de fechamento)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['identity']));

  const canEdit = userRole === 'master' || character?.user_id === currentUserId;

  // ✅ Memoiza valores padrão do formulário
  const defaultValues = useMemo(() => character || ({} as Character), [character]);
  const form = useForm<Character>({ defaultValues });
  const { handleSubmit, reset } = form;

  // ✅ Reset somente quando character muda de fato
  useEffect(() => {
    if (character) reset(character);
  }, [character?.id, reset]);

  // ✅ Memoiza definição de seções para não recriar em cada render
  const sections = useMemo(
    () => [
      {
        id: 'identity',
        title: 'Identidade do Personagem',
        icon: PersonIcon,
        component: CharacterIdentityForm,
      },
      { id: 'attributes', title: 'Atributos', icon: FlashIcon, component: AttributesForm },
      {
        id: 'combat',
        title: 'Estatísticas de Combate',
        icon: ShieldIcon,
        component: CombatStatsForm,
      },
      { id: 'status', title: 'Status e Condições', icon: StatusIcon, component: null },
      {
        id: 'skills',
        title: 'Perícias e Resistências',
        icon: SchoolIcon,
        component: SkillsAndSavesForm,
      },
      {
        id: 'attacks',
        title: 'Ataques e Magias',
        icon: SwordIcon,
        component: AttacksAndSpellsForm,
      },
      { id: 'inventory', title: 'Inventário', icon: BackpackIcon, component: InventoryForm },
      {
        id: 'traits',
        title: 'Características e Habilidades',
        icon: StarIcon,
        component: TraitsAndAbilitiesForm,
      },
      {
        id: 'appearance',
        title: 'Aparência e História',
        icon: FaceIcon,
        component: AppearanceAndBackstoryForm,
      },
    ],
    []
  );

  // ✅ Toggle eficiente + preserva animação
  const handleSectionToggle = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      const isClosing = newSet.has(section);

      if (isClosing) {
        newSet.delete(section);
        // Aguarda animação (~300ms) antes de desmontar o conteúdo
        setTimeout(() => {
          setVisibleSections((vs) => {
            const updated = new Set(vs);
            updated.delete(section);
            return updated;
          });
        }, 300);
      } else {
        newSet.add(section);
        setVisibleSections((vs) => new Set(vs).add(section));
      }

      return newSet;
    });
  }, []);

  // ✅ Salvar assíncrono para evitar bloqueios
  const handleSave = handleSubmit(async (formData) => {
    if (!character) return;
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  });

  const handleCancel = useCallback(() => {
    if (character) reset(character);
    onClose();
  }, [character, reset, onClose]);

  // ✅ Condições convertidas para array sempre
  const conditions: string[] = useMemo(() => {
    if (!character?.character_sheet.conditions) return [];
    return Array.isArray(character.character_sheet.conditions)
      ? character.character_sheet.conditions
      : String(character.character_sheet.conditions).split(' ');
  }, [character]);

  const handleAddCondition = useCallback(
    async (condition: string) => {
      if (!character || !condition.trim() || conditions.includes(condition.trim())) return;
      setIsLoading(true);
      await onSave({
        ...character,
        character_sheet: {
          ...character.character_sheet,
          conditions: [...conditions, condition.trim()],
        },
      });
      setIsLoading(false);
    },
    [character, conditions, onSave]
  );

  const handleRemoveCondition = useCallback(
    async (condition: string) => {
      if (!character) return;
      setIsLoading(true);
      await onSave({
        ...character,
        character_sheet: {
          ...character.character_sheet,
          conditions: conditions.filter((c) => c !== condition),
        },
      });
      setIsLoading(false);
    },
    [character, conditions, onSave]
  );

  if (!character) return null;

  return (
    <>
      {open && (
        <S.ModalContainer open={open} onClose={handleCancel}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <S.ModalContent>
              <FormProvider {...form}>
                {/* HEADER */}
                <S.Header>
                  <S.CharacterAvatar>
                    <Avatar
                      src={character.character_sheet.avatar as string}
                      alt={character.name}
                      sx={{ width: 80, height: 80 }}
                    />
                  </S.CharacterAvatar>

                  <S.CharacterInfo>
                    <Box>
                      <S.CharacterName>{character.name}</S.CharacterName>
                      <Typography variant="subtitle1" color="text.secondary">
                        {character.character_class} {character.character_sheet.race as string} •
                        Nível {character.status.level}
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
                          value={character.status.hitPoints.current}
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
                          value={character.status.hitPoints.maximum}
                          disabled={!canEdit}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: alpha(theme.palette.background.paper, 0.1),
                            },
                          }}
                        />
                      </Grid>
                      {character.status.mana && (
                        <>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <TextField
                              size="small"
                              label="Mana Atual"
                              type="number"
                              value={character.status.mana.current}
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
                              value={character.status.mana.maximum}
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

                {/* CONTENT */}
                <S.ContentContainer>
                  {sections.map(({ id, title, icon: SectionIcon, component: SectionComponent }) => {
                    const isExpanded = expandedSections.has(id);
                    const isVisible = visibleSections.has(id);

                    return (
                      <S.SectionContainer
                        key={id}
                        expanded={isExpanded}
                        onChange={() => handleSectionToggle(id)}
                      >
                        <S.SectionHeader expandIcon={<ExpandMoreRounded />}>
                          <SectionIcon sx={{ mr: 1 }} />
                          <S.SectionTitle>{title}</S.SectionTitle>
                        </S.SectionHeader>

                        {isVisible && (
                          <AccordionDetails>
                            {id === 'status' ? (
                              <StatusAndConditionsManager
                                conditions={conditions}
                                onAddCondition={handleAddCondition}
                                onRemoveCondition={handleRemoveCondition}
                                canEdit={canEdit}
                              />
                            ) : SectionComponent ? (
                              <SectionComponent />
                            ) : null}
                          </AccordionDetails>
                        )}
                      </S.SectionContainer>
                    );
                  })}
                </S.ContentContainer>

                {/* FOOTER */}
                {canEdit && (
                  <S.Footer>
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
          </Box>
        </S.ModalContainer>
      )}
    </>
  );
};
