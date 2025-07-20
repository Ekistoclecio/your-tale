import { Stack, styled } from '@mui/material';
import { MotionButton } from '../../atoms/MotionButton';
import { MotionCard } from '../../atoms/MotionCard';

export const Card = styled(MotionCard)(({ theme }) => ({
  padding: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
}));

export const TitleGroup = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const CreateButton = styled(MotionButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));
