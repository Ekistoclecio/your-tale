import { alpha, Box, Grid, TextField, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export const CombatStatsForm = () => {
  const theme = useTheme();
  const { register } = useFormContext();
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.combatStats.armorClass')}
            label="Classe de Armadura"
            slotProps={{ htmlInput: { min: 1, max: 50 } }}
            helperText="CA total"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.combatStats.initiative')}
            label="Iniciativa"
            slotProps={{ htmlInput: { min: -10, max: 20 } }}
            helperText="Bônus de iniciativa"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.combatStats.speed')}
            label="Deslocamento"
            slotProps={{ htmlInput: { min: 0, max: 200 } }}
            helperText="Pés por turno"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.combatStats.hitDice')}
            label="Dados de Vida"
            placeholder="ex: 1d8"
            helperText="Formato: NdM"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            {...register('status.hitPoints.maximum')}
            label="PV Máximo"
            slotProps={{ htmlInput: { min: 1 } }}
            helperText="Pontos de vida totais"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            {...register('status.hitPoints.current')}
            label="PV Atuais"
            slotProps={{ htmlInput: { min: 0 } }}
            helperText="Pontos de vida atuais"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            {...register('status.hitPoints.temporary')}
            label="PV Temporários"
            slotProps={{ htmlInput: { min: 0 } }}
            helperText="PV temporários"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            {...register('character_sheet.resistances')}
            label="Resistências"
            placeholder="ex: Fogo, Gelo, Veneno"
            multiline
            rows={2}
            helperText="Liste as resistências do personagem"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

CombatStatsForm.displayName = 'CombatStatsForm';
