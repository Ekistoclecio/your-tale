import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import * as S from './styles';

interface AttributeInputProps {
  name: string;
  label: string;
  abbreviation: string;
  color?: string;
}

export const AttributeInput = ({
  name,
  label,
  abbreviation,
  color = 'primary.main',
}: AttributeInputProps) => {
  const { control, watch } = useFormContext();

  const attributeValue = watch(name).value;
  const calculateModifier = (value: number): number => Math.floor((value - 10) / 2);
  const modifier = useMemo(() => calculateModifier(attributeValue), [attributeValue]);
  const formatModifier = (modifier: number): string =>
    modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <S.Card elevation={2} bordercolor={color}>
      <S.TopBar bgcolor={color} />

      <S.Header>
        <Typography variant="h6" component="h3" fontWeight="bold" color={color} gutterBottom>
          {abbreviation}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </S.Header>

      <Controller
        name={`${name}.value`}
        control={control}
        render={({ field }) => (
          <Box>
            <S.ValueInput {...field} size="small" type="number" inputProps={{ min: 1, max: 30 }} />

            <S.ModifierBox bgcolor={color}>
              <Typography variant="caption" color="text.secondary" display="block">
                Modificador
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={color}>
                {formatModifier(modifier)}
              </Typography>
            </S.ModifierBox>
          </Box>
        )}
      />
    </S.Card>
  );
};

AttributeInput.displayName = 'AttributeInput';
