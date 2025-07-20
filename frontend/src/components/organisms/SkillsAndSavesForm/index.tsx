import { Box, Grid, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { SkillCheckbox } from '@/components/molecules';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import { Shield as ShieldIcon } from '@mui/icons-material';

const skills = [
  {
    name: 'skills.acrobatics',
    skillName: 'Acrobacia',
    attributeName: 'DES',
    attributePath: 'attributes.dexterity.value',
  },
  {
    name: 'skills.animalHandling',
    skillName: 'Trato com Animais',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
  {
    name: 'skills.arcana',
    skillName: 'Arcano',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'skills.athletics',
    skillName: 'Atletismo',
    attributeName: 'FOR',
    attributePath: 'attributes.strength.value',
  },
  {
    name: 'skills.deception',
    skillName: 'Enganação',
    attributeName: 'CAR',
    attributePath: 'attributes.charisma.value',
  },
  {
    name: 'skills.history',
    skillName: 'História',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'skills.insight',
    skillName: 'Intuição',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
  {
    name: 'skills.intimidation',
    skillName: 'Intimidação',
    attributeName: 'CAR',
    attributePath: 'attributes.charisma.value',
  },
  {
    name: 'skills.investigation',
    skillName: 'Investigação',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'skills.medicine',
    skillName: 'Medicina',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
  {
    name: 'skills.nature',
    skillName: 'Natureza',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'skills.perception',
    skillName: 'Percepção',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
  {
    name: 'skills.performance',
    skillName: 'Atuação',
    attributeName: 'CAR',
    attributePath: 'attributes.charisma.value',
  },
  {
    name: 'skills.persuasion',
    skillName: 'Persuasão',
    attributeName: 'CAR',
    attributePath: 'attributes.charisma.value',
  },
  {
    name: 'skills.religion',
    skillName: 'Religião',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'skills.sleightOfHand',
    skillName: 'Prestidigitação',
    attributeName: 'DES',
    attributePath: 'attributes.dexterity.value',
  },
  {
    name: 'skills.stealth',
    skillName: 'Furtividade',
    attributeName: 'DES',
    attributePath: 'attributes.dexterity.value',
  },
  {
    name: 'skills.survival',
    skillName: 'Sobrevivência',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
];

const savingThrows = [
  {
    name: 'savingThrows.strength',
    skillName: 'Força',
    attributeName: 'FOR',
    attributePath: 'attributes.strength.value',
  },
  {
    name: 'savingThrows.dexterity',
    skillName: 'Destreza',
    attributeName: 'DES',
    attributePath: 'attributes.dexterity.value',
  },
  {
    name: 'savingThrows.constitution',
    skillName: 'Constituição',
    attributeName: 'CON',
    attributePath: 'attributes.constitution.value',
  },
  {
    name: 'savingThrows.intelligence',
    skillName: 'Inteligência',
    attributeName: 'INT',
    attributePath: 'attributes.intelligence.value',
  },
  {
    name: 'savingThrows.wisdom',
    skillName: 'Sabedoria',
    attributeName: 'SAB',
    attributePath: 'attributes.wisdom.value',
  },
  {
    name: 'savingThrows.charisma',
    skillName: 'Carisma',
    attributeName: 'CAR',
    attributePath: 'attributes.charisma.value',
  },
];

export const SkillsAndSavesForm = () => {
  const theme = useTheme();
  const { watch } = useFormContext();

  const calculateModifier = (attributeValue: number): number => {
    return Math.floor((attributeValue - 10) / 2);
  };

  const getAttributeValue = (path: string): number => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], watch());
    return value ? Number(value) : 10;
  };

  return (
    <Box
      component={motion.div}
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Perícias
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Marque as perícias em que seu personagem é proficiente
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {skills.map((skill) => {
              const attributeValue = getAttributeValue(skill.attributePath);
              const modifier = calculateModifier(attributeValue);

              return (
                <SkillCheckbox
                  key={skill.name}
                  name={skill.name}
                  skillName={skill.skillName}
                  attributeName={skill.attributeName}
                  attributeModifier={modifier}
                  isProficient={false}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Testes de Resistência
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Marque as resistências em que seu personagem é proficiente
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {savingThrows.map((save) => {
              const attributeValue = getAttributeValue(save.attributePath);
              const modifier = calculateModifier(attributeValue);

              return (
                <SkillCheckbox
                  key={save.name}
                  name={save.name}
                  skillName={save.skillName}
                  attributeName={save.attributeName}
                  attributeModifier={modifier}
                  isProficient={false}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>

      {/* <Divider sx={{ my: 3 }} /> */}

      {/* <Box>
        <Typography variant="body2" color="text.secondary">
          <strong>Dica:</strong> O bônus de proficiência é +2 no nível 1. Seu mestre pode ajustar as
          perícias disponíveis baseado na classe e antecedente do seu personagem.
        </Typography>
      </Box> */}
    </Box>
  );
};

SkillsAndSavesForm.displayName = 'SkillsAndSavesForm';
