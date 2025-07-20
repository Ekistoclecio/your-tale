'use client';

import { TextField, IconButton, Tooltip } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { AutoAwesome } from '@mui/icons-material';

import { Wrapper, ControlsBox, IconButtonWrapper, CharCount } from './styles';

interface BackstoryEditorProps {
  name: string;
  label: string;
  maxLength?: number;
}

export const BackstoryEditor = ({ name, label, maxLength = 1000 }: BackstoryEditorProps) => {
  const { control } = useFormContext();

  return (
    <Wrapper>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <TextField
              {...field}
              label={label}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={{
                htmlInput: {
                  maxLength,
                },
              }}
            />

            <ControlsBox>
              <IconButtonWrapper>
                <Tooltip arrow placement="right" title="Sugestão de IA (em breve)">
                  <span>
                    <IconButton size="small" color="primary" disabled>
                      <AutoAwesome fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </IconButtonWrapper>

              <CharCount
                color={
                  (field.value?.length || 0) > maxLength * 0.9 ? 'warning.main' : 'text.secondary'
                }
              >
                {field.value?.length || 0}/{maxLength}
              </CharCount>
            </ControlsBox>
          </>
        )}
      />
    </Wrapper>
  );
};

BackstoryEditor.displayName = 'BackstoryEditor';
