'use client';

import { Delete } from '@mui/icons-material';
import { Attack } from '../AttackForm';

import { StyledCard, HeaderBox, AttackName, StyledIconButton, DetailText } from '../cardStyles';

interface AttackCardProps {
  attack: Attack;
  index: number;
  removeAttack: (index: number) => void;
}

export const AttackCard = ({ attack, index, removeAttack }: AttackCardProps) => {
  return (
    <StyledCard>
      <HeaderBox>
        <AttackName>{attack.name || 'Ataque sem nome'}</AttackName>
        <StyledIconButton size="small" color="error" onClick={() => removeAttack(index)}>
          <Delete fontSize="small" />
        </StyledIconButton>
      </HeaderBox>

      <DetailText>
        <strong>Bônus:</strong> +{attack.bonus} | <strong>Dano:</strong> {attack.damage}
      </DetailText>
      <DetailText>
        <strong>Tipo:</strong> {attack.type} | <strong>Dano:</strong> {attack.damageType}
      </DetailText>
      {attack.range && (
        <DetailText>
          <strong>Alcance:</strong> {attack.range}
        </DetailText>
      )}
      {attack.notes && (
        <DetailText>
          <strong>Notas:</strong> {attack.notes}
        </DetailText>
      )}
    </StyledCard>
  );
};

AttackCard.displayName = 'AttackCard';
