'use client';

import { Checkbox } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import {
  SkillContainer,
  StyledFormControlLabel,
  LabelWrapper,
  SkillName,
  AttributeName,
  ModifierValue,
} from './styles';

interface SkillCheckboxProps {
  name: string;
  skillName: string;
  attributeName: string;
  attributeModifier: number;
  isProficient: boolean;
}

export const SkillCheckbox = ({
  name,
  skillName,
  attributeName,
  attributeModifier,
  isProficient,
}: SkillCheckboxProps) => {
  const { control } = useFormContext();
  const proficiencyBonus = isProficient ? 2 : 0;
  const totalBonus = attributeModifier + proficiencyBonus;

  return (
    <SkillContainer>
      <StyledFormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={field.value || false} size="small" />
            )}
          />
        }
        label={
          <LabelWrapper>
            <SkillName variant="body2">{skillName}</SkillName>
            <AttributeName variant="caption">({attributeName})</AttributeName>
          </LabelWrapper>
        }
      />

      <ModifierValue variant="body2" color={totalBonus >= 0 ? 'success.main' : 'error.main'}>
        {totalBonus >= 0 ? `+${totalBonus}` : `${totalBonus}`}
      </ModifierValue>
    </SkillContainer>
  );
};

SkillCheckbox.displayName = 'SkillCheckbox';
