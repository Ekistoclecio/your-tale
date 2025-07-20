import {
  alpha,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

const classes = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
  'Patrulheiro',
];

const races = [
  'Humano',
  'Elfo',
  'Anão',
  'Halfling',
  'Dragonborn',
  'Gnomo',
  'Meio-Elfo',
  'Meio-Orc',
  'Tiefling',
  'Aarakocra',
  'Genasi',
  'Goliath',
];

const alignments = [
  'Leal e Bom',
  'Neutro e Bom',
  'Caótico e Bom',
  'Leal e Neutro',
  'Neutro',
  'Caótico e Neutro',
  'Leal e Mau',
  'Neutro e Mau',
  'Caótico e Mau',
];

const backgrounds = [
  'Acólito',
  'Artesão',
  'Artista',
  'Charlatão',
  'Criminoso',
  'Eremita',
  'Forasteiro',
  'Guild Artesão',
  'Herói do Povo',
  'Marinheiro',
  'Nobre',
  'Sábio',
];

export const CharacterIdentityForm = () => {
  const theme = useTheme();
  const { register, control } = useFormContext();
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('name')}
            label="Nome do Personagem"
            placeholder="Digite o nome do seu personagem"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('playerName')}
            label="Nome do Jogador"
            placeholder="Seu nome"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="class"
            control={control}
            rules={{ required: 'Classe é obrigatória' }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Classe</InputLabel>
                <Select {...field} label="Classe">
                  {classes.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="race"
            control={control}
            rules={{ required: 'Raça é obrigatória' }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Raça</InputLabel>
                <Select {...field} label="Raça">
                  {races.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="background"
            control={control}
            rules={{ required: 'Antecedente é obrigatório' }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Antecedente</InputLabel>
                <Select {...field} label="Antecedente">
                  {backgrounds.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="alignment"
            control={control}
            rules={{ required: 'Alinhamento é obrigatório' }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Alinhamento</InputLabel>
                <Select {...field} label="Alinhamento">
                  {alignments.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('level')}
            label="Nível"
            type="number"
            slotProps={{
              htmlInput: {
                min: 1,
                max: 20,
              },
            }}
            helperText="Nível atual do personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('experiencePoints')}
            label="Pontos de Experiência"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            helperText="XP total acumulado"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

CharacterIdentityForm.displayName = 'CharacterIdentityForm';
