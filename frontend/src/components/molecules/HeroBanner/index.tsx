import { Add, QrCode, Campaign } from '@mui/icons-material';
import * as S from './styles';
import { Box } from '@mui/material';
import Wizard from '../../../assets/icons/wizard.svg';

interface HeroBannerProps {
  onCreateSession: () => void;
  onEnterCode: () => void;
  onViewSessions: () => void;
}

export const HeroBanner = ({ onCreateSession, onEnterCode, onViewSessions }: HeroBannerProps) => {
  return (
    <Box width="100%">
      <S.Container>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={3} mb={4}>
          <Wizard width={48} height={48} />
          <S.HeroTitle variant="h3">Bem-vindo, Aventureiro</S.HeroTitle>
        </Box>

        <S.HeroSubtitle variant="h6">
          Hoje é um ótimo dia para forjar lendas ou reviver aventuras.
        </S.HeroSubtitle>

        <S.ButtonGroup>
          <S.CreateButton
            animationVariant="subtleBounce"
            onClick={onCreateSession}
            startIcon={<Add />}
          >
            Criar sessão
          </S.CreateButton>

          <S.EnterCodeButton
            animationVariant="subtleBounce"
            onClick={onEnterCode}
            startIcon={<QrCode />}
          >
            Entrar com código
          </S.EnterCodeButton>

          <S.ViewSessionsButton
            animationVariant="subtleBounce"
            onClick={onViewSessions}
            startIcon={<Campaign />}
          >
            Ver minhas campanhas
          </S.ViewSessionsButton>
        </S.ButtonGroup>
      </S.Container>
    </Box>
  );
};
