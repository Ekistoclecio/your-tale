import { styled, alpha } from '@mui/material';
import { Paper, Box, Stepper } from '@mui/material';
import { MotionButton } from '@/components/atoms';

export const AnimatedIntro = styled(Box)({
  marginBottom: '2rem',
});

export const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(
    135deg,
    ${alpha(theme.palette.primary.main, 0.7)} 0%,
    ${alpha(theme.palette.primary.dark, 0.9)} 100%
  )`,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  boxShadow: `0 0 12px ${alpha(theme.palette.secondary.dark, 0.15)}`,
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    width: 36,
    height: 36,
    fontSize: '1.25rem',
    color: theme.palette.secondary.dark,
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
    '&.Mui-active': {
      color: theme.palette.secondary.main,
    },
    '& .MuiStepIcon-text': {
      fill: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  },
  '& .MuiStepConnector-line': {
    borderLeftWidth: 2,
    marginLeft: '5px',
  },
  '& .MuiStepContent-root': {
    marginLeft: '17px',
    borderLeft: `2px solid ${theme.palette.text.secondary}`,
  },
}));

export const NextStepButton = styled(MotionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.secondary.contrastText,
  boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
    transform: 'translateY(-2px)',
  },
}));

export const CreateCharacterButton = styled(MotionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.secondary.contrastText,
  boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
    transform: 'translateY(-2px)',
  },
}));
