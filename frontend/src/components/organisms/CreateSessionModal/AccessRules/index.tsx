import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { FormControlLabel, Switch, Box, FormLabel, Slider } from '@mui/material';

export const AccessRules = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name="join_after_start"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch checked={field.value} onChange={field.onChange} />}
            label="Permitir novos jogadores após o início?"
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="player_limit"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Limite de Jogadores: {field.value}
            </FormLabel>
            <Slider
              value={field.value}
              onChange={(_, value) => field.onChange(value)}
              min={2}
              max={10}
              marks
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      />
    </>
  );
};
