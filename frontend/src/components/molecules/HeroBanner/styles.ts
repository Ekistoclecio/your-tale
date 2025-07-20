import { MotionButton } from '@/components/atoms/MotionButton';
import { Box, Typography, styled, alpha, lighten } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(
      135deg,
      ${alpha(theme.palette.secondary.main, 0.15)} 0%,
      ${alpha(theme.palette.primary.dark, 0.2)} 100%
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='parchment' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M20 20c0-5 5-10 10-10s10 5 10 10M60 60c0-5 5-10 10-10s10 5 10 10' stroke='${encodeURIComponent(
      alpha(theme.palette.secondary.main, 0.1)
    )}' stroke-width='2' fill='none'/%3E%3Ccircle cx='30' cy='70' r='3' fill='${encodeURIComponent(
      alpha(theme.palette.secondary.main, 0.1)
    )}'/%3E%3Ccircle cx='70' cy='30' r='3' fill='${encodeURIComponent(
      alpha(theme.palette.secondary.main, 0.1)
    )}'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23parchment)'/%3E%3C/svg%3E")
  `,
  border: '2px solid',
  borderColor: theme.palette.secondary.main,
  borderRadius: '20px',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5),
  },
  minHeight: '250px',
  [theme.breakpoints.up('md')]: {
    minHeight: '300px',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.dark, 0.3)}`,
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: 'var(--font-pirata-one)',
  textShadow: '0 4px 8px rgba(0,0,0,0.5)',
  fontSize: '2.5rem',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: 'var(--font-cinzel)',
  marginBottom: '32px',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  fontSize: '1.2rem',
  maxWidth: '600px',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

export const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

export const CreateButton = styled(MotionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.secondary.contrastText,
  boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
    transform: 'translateY(-2px)',
  },
}));

export const EnterCodeButton = styled(MotionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  color: theme.palette.secondary.main,
  '&:hover': {
    borderColor: theme.palette.secondary.light,
    backgroundColor: alpha(theme.palette.secondary.light, 0.15),
    transform: 'translateY(-2px)',
  },
}));

export const ViewSessionsButton = styled(MotionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: lighten(theme.palette.primary.light, 0.1),
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
}));
