import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import {
  TextField,
  Stack,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { Public as PublicIcon, Lock as LockIcon } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';

export const BasicInfos = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Título da Sessão"
            placeholder="Ex: A Lenda do Vale Esquecido"
            error={!!errors.title}
            helperText={(errors.title?.message as string) || `${field.value.length}/60`}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Descrição da Sessão"
            placeholder="Descreva brevemente a aventura..."
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message as string}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="isPublic"
        control={control}
        render={({ field }) => (
          <Stack spacing={2}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Visibilidade da Sessão
            </FormLabel>
            <ToggleButtonGroup
              value={field.value ? 'public' : 'private'}
              exclusive
              onChange={(_, value) => {
                if (value !== null) {
                  field.onChange(value === 'public');
                }
              }}
              fullWidth
            >
              <ToggleButton value="public">
                <PublicIcon sx={{ mr: 1, width: 16, height: 16 }} />
                Pública
              </ToggleButton>
              <ToggleButton value="private">
                <LockIcon sx={{ mr: 1, width: 16, height: 16 }} />
                Privada
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              <InfoIcon sx={{ mb: -1, mr: 1, width: 20, height: 20 }} />
              Sessões públicas aparecem para outros usuários
            </Typography>
          </Stack>
        )}
      />
    </>
  );
};
