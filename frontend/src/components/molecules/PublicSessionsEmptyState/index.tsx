'use client';

import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { animationVariants } from '@/constants/animation';
import Gladiator from '@/assets/icons/gladiator.svg';
import Shield from '@/assets/icons/shield.svg';
import * as S from './styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface PublicSessionsEmptyStateProps {
  onCreateSession: () => void;
}

export const PublicSessionsEmptyState = ({ onCreateSession }: PublicSessionsEmptyStateProps) => {
  return (
    <motion.div {...animationVariants.fadeSlideIn}>
      <S.Card cardVariant="session">
        <Gladiator width={72} height={72} />

        <S.TitleGroup direction="row" alignItems="center" gap={1}>
          <Shield width={28} height={28} />
          <Typography variant="h4">Nenhuma sessão pública encontrada</Typography>
        </S.TitleGroup>

        <Typography variant="body1" maxWidth="400px" textAlign="center">
          Que tal criar uma agora? Sua próxima aventura aguarda por você.
        </Typography>

        <S.CreateButton
          animationVariant="subtleBounce"
          variant="contained"
          size="large"
          onClick={onCreateSession}
          startIcon={<AutoAwesomeIcon color="primary" />}
        >
          Criar nova sessão
        </S.CreateButton>
      </S.Card>
    </motion.div>
  );
};
