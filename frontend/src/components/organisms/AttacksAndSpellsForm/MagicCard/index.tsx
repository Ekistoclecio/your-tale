import { Delete } from '@mui/icons-material';
import { Spell } from '../MagicForm';
import { AttackName, DetailText, HeaderBox, StyledCard, StyledIconButton } from '../cardStyles';

interface MagicCardProps {
  spell: Spell;
  index: number;
  removeSpell: (index: number) => void;
}

export const MagicCard = ({ spell, index, removeSpell }: MagicCardProps) => {
  return (
    <StyledCard>
      <HeaderBox>
        <AttackName>{spell.name || 'Magia sem nome'}</AttackName>
        <StyledIconButton size="small" color="error" onClick={() => removeSpell(index)}>
          <Delete fontSize="small" />
        </StyledIconButton>
      </HeaderBox>

      <DetailText>
        <strong>Nível:</strong> {spell.level} | <strong>Escola:</strong> {spell.school}
      </DetailText>
      <DetailText>
        <strong>Tempo:</strong> {spell.castingTime} | <strong>Alcance:</strong> {spell.range}
      </DetailText>
      <DetailText>
        <strong>Duração:</strong> {spell.duration}
      </DetailText>
      {spell.prepared && <DetailText>✓ Preparada</DetailText>}
    </StyledCard>
  );
};
