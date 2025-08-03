'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
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
import { MotionButton } from '@/components/atoms';
import {
  // createCharacterSchema,
  CreateCharacterFormData,
} from '@/schemas/form-validation/createCharacterForm';
import * as S from './styles';

interface CharacterFormTemplateProps {
  onSubmit: (data: CreateCharacterFormData) => void;
  isLoading?: boolean;
}

const steps = [
  {
    label: 'Identidade do Personagem',
    description: 'Informações básicas do personagem',
    component: CharacterIdentityForm,
  },
  {
    label: 'Atributos',
    description: 'Força, Destreza, Constituição, etc.',
    component: AttributesForm,
  },
  {
    label: 'Estatísticas de Combate',
    description: 'CA, PV, Iniciativa, etc.',
    component: CombatStatsForm,
  },
  {
    label: 'Perícias e Resistências',
    description: 'Habilidades e testes de resistência',
    component: SkillsAndSavesForm,
  },
  { label: 'Ataques', description: 'Ataques físicos e mágicos', component: AttacksAndSpellsForm },
  { label: 'Inventário', description: 'Equipamentos e moedas', component: InventoryForm },
  {
    label: 'Características e Habilidades',
    description: 'Habilidades especiais e anotações',
    component: TraitsAndAbilitiesForm,
  },
  {
    label: 'Aparência e História',
    description: 'Aparência física e história do personagem',
    component: AppearanceAndBackstoryForm,
  },
];

export const CharacterFormTemplate = ({
  onSubmit,
  isLoading = false,
}: CharacterFormTemplateProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm<CreateCharacterFormData>({
    // resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      name: '',
      character_class: '',
      status: {
        hitPoints: { maximum: 1, current: 1, temporary: 0 },
        experiencePoints: 0,
        level: 1,
      },
      character_sheet: {
        race: '',
        alignment: '',
        background: '',
        playerName: '',
        attributes: {
          strength: { value: 10, modifier: 0 },
          dexterity: { value: 10, modifier: 0 },
          constitution: { value: 10, modifier: 0 },
          intelligence: { value: 10, modifier: 0 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 10, modifier: 0 },
        },
        combatStats: {
          armorClass: 10,
          initiative: 0,
          speed: 30,
          hitDice: '',
        },
        skills: {},
        savingThrows: {},
        attacks: [],
        spells: [],
        coins: {
          copper: 0,
          silver: 0,
          electrum: 0,
          gold: 0,
          platinum: 0,
        },
        equipment: '',
        weight: 0,
        carryingCapacity: 0,
        magicItems: '',
        treasures: '',
        inventoryNotes: '',
        racialTraits: '',
        classFeatures: '',
        feats: '',
        specialAbilities: '',
        conditions: '',
        traitsNotes: '',
        appearance: {
          age: 25,
          height: '',
          weight: '',
          eyes: '',
          skin: '',
          hair: '',
          distinguishingFeatures: '',
          clothing: '',
          description: '',
        },
        position: {
          x: 400,
          y: 400,
        },
        backstory: '',
        personality: '',
        ideals: '',
        bonds: '',
        flaws: '',
        additionalNotes: '',
      },
    },
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = form.handleSubmit((data) => {
    console.log('Dados do formulário:', data);
    onSubmit(data);
  });
  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    console.log('Erros do formulário:', form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <S.AnimatedIntro>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Criar Novo Personagem
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Preencha as informações do seu personagem seguindo as regras do D&D 5e
        </Typography>
      </S.AnimatedIntro>

      <FormProvider {...form}>
        <S.FormContainer>
          <S.StyledStepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              const StepComponent = step.component;
              return (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="h5" fontWeight="bold" color="secondary.main">
                      {step.label}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <StepComponent />
                    </Box>
                    <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                      {index > 0 && (
                        <MotionButton
                          onClick={handleBack}
                          variant="outlined"
                          color="secondary"
                          animationVariant="subtleBounce"
                        >
                          Voltar
                        </MotionButton>
                      )}
                      {!isLastStep && (
                        <S.NextStepButton
                          variant="contained"
                          onClick={handleNext}
                          disabled={isLastStep}
                          animationVariant="subtleBounce"
                        >
                          Próximo
                        </S.NextStepButton>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </S.StyledStepper>

          {isLastStep && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <S.CreateCharacterButton
                variant="contained"
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                animationVariant="subtleBounce"
              >
                {isLoading ? <CircularProgress size={24} /> : 'Criar Personagem'}
              </S.CreateCharacterButton>
            </Box>
          )}
        </S.FormContainer>
      </FormProvider>
    </Container>
  );
};

CharacterFormTemplate.displayName = 'CharacterFormTemplate';
