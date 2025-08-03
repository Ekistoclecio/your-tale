import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Typography,
  TextField,
  FormLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PersonPin as PersonIcon, SmartToy as SmartToyIcon } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { narrativeStyles } from '@/schemas/form-validation/createSessionForm';

export const SessionMasterConfig = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const isAiMaster = watch('is_ai_master');

  return (
    <>
      <Controller
        name="is_ai_master"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              value={String(field.value)}
              onChange={(e) => field.onChange(e.target.value === 'true')}
              row
            >
              <FormControlLabel
                value="false"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Eu serei o mestre
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SmartToyIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Mestre IA
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        )}
      />

      {/* Campos condicionais para mestre IA */}
      <AnimatePresence>
        {isAiMaster && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Controller
              name="ai_theme"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Temática da história"
                  placeholder="Ex: fantasia sombria, steampunk"
                  error={!!errors.ai_theme}
                  helperText={(errors.ai_theme?.message as string) || ''}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="ai_narrative_style"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Estilo narrativo</FormLabel>
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.ai_narrative_style}
                    displayEmpty
                    renderValue={(value: unknown): ReactNode => {
                      if (value === '') {
                        return <em>Selecione um estilo</em>;
                      }
                      return value as ReactNode;
                    }}
                  >
                    {narrativeStyles.map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="ai_campaign_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Descrição introdutória da campanha"
                  placeholder="Descreva o início da aventura..."
                  multiline
                  rows={4}
                  error={!!errors.ai_campaign_description}
                  helperText={(errors.ai_campaign_description?.message as string) || ''}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
