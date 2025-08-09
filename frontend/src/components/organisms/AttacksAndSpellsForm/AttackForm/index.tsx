'use client';

import {
  Grid,
  TextField,
  MenuItem,
  Select,
  Button,
  useTheme,
  FormControl,
  InputLabel,
} from '@mui/material';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import { Controller, useFormContext } from 'react-hook-form';

import { StyledCard, HeaderBox, HeaderTitle, ActionsBox } from '../formStyles';

export interface Attack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
  damageType: string;
  range: string;
  notes: string;
}

const attackTypes = ['Corpo a Corpo', 'À Distância', 'Arremesso', 'Natural', 'Mágico'];
const damageTypes = [
  'Cortante',
  'Perfurante',
  'Concussão',
  'Fogo',
  'Gelo',
  'Elétrico',
  'Ácido',
  'Veneno',
  'Psíquico',
  'Radiante',
  'Necrótico',
  'Força',
  'Trovão',
];

interface AttackFormProps {
  setShowAttackForm: (show: boolean) => void;
  appendAttack: (attack: Attack) => void;
  attackFields: Attack[];
}

export const AttackForm = ({ setShowAttackForm, appendAttack, attackFields }: AttackFormProps) => {
  const theme = useTheme();
  const { register, control } = useFormContext();
  const index = attackFields.length;

  const handleAddAttack = () => {
    appendAttack({
      name: '',
      bonus: 0,
      damage: '',
      type: 'Corpo a Corpo',
      damageType: 'Cortante',
      range: '',
      notes: '',
    });
    setShowAttackForm(false);
  };

  return (
    <StyledCard variant="outlined">
      <HeaderBox>
        <SportsMartialArtsIcon sx={{ color: theme.palette.secondary.light }} />
        <HeaderTitle>Novo Ataque</HeaderTitle>
      </HeaderBox>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`character_sheet.attacks.${index}.name`)}
            label="Nome do Ataque"
            placeholder="ex: Espada Longa"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`character_sheet.attacks.${index}.bonus`)}
            label="Bônus de Ataque"
            placeholder="+5"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`character_sheet.attacks.${index}.damage`)}
            label="Dano"
            placeholder="ex: 1d8+3"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            control={control}
            name={`character_sheet.attacks.${index}.type`}
            defaultValue={attackTypes[0]}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={`attack-type-label-${index}`}>Tipo de Ataque</InputLabel>
                <Select {...field} labelId={`attack-type-label-${index}`} label="Tipo de Ataque">
                  {attackTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            control={control}
            name={`character_sheet.attacks.${index}.damageType`}
            defaultValue={damageTypes[0]}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={`attack-damage-type-label-${index}`}>Tipo de Dano</InputLabel>
                <Select
                  {...field}
                  labelId={`attack-damage-type-label-${index}`}
                  label="Tipo de Dano"
                >
                  {damageTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`character_sheet.attacks.${index}.range`)}
            label="Alcance"
            placeholder="ex: 5 pés"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register(`character_sheet.attacks.${index}.notes`)}
            label="Notas"
            placeholder="Características especiais do ataque"
            multiline
            rows={2}
            fullWidth
          />
        </Grid>
      </Grid>

      <ActionsBox>
        <Button variant="contained" onClick={handleAddAttack}>
          Adicionar
        </Button>
        <Button variant="outlined" onClick={() => setShowAttackForm(false)}>
          Cancelar
        </Button>
      </ActionsBox>
    </StyledCard>
  );
};

AttackForm.displayName = 'AttackForm';
