import { MotionButton, MotionCard } from '@/components/atoms';
import { Box, Typography, styled } from '@mui/material';

export const Card = styled(MotionCard)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: '250px',
  height: '250px',
}));

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const MasterInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const MasterName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  height: '50px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const DescriptionBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StatusBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const StatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  alignSelf: 'center',
}));

export const ActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const CharacterButton = styled(MotionButton)(({ theme }) => ({
  borderColor: theme.palette.secondary.main,
  color: theme.palette.secondary.main,
  '&:hover': {
    borderColor: theme.palette.secondary.light,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));
