import { Box, Button, styled, alpha } from '@mui/material';

export const Container = styled(Box)(({ theme }) => {
  const secondaryAlpha10 = alpha(theme.palette.secondary.main, 0.1);
  const primaryAlpha30 = alpha(theme.palette.primary.main, 0.3);
  const primaryLightAlpha20 = alpha(theme.palette.primary.light, 0.2);

  return {
    background: `
      linear-gradient(135deg, ${primaryAlpha30} 0%, ${primaryLightAlpha20} 100%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='magic' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='2' fill='${encodeURIComponent(
        secondaryAlpha10
      )}'/%3E%3Ccircle cx='15' cy='15' r='1' fill='${encodeURIComponent(
        secondaryAlpha10
      )}'/%3E%3Ccircle cx='45' cy='45' r='1' fill='${encodeURIComponent(secondaryAlpha10)}'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23magic)'/%3E%3C/svg%3E")
    `,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '16px',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 50%, ${secondaryAlpha10} 0%, transparent 50%)`,
      pointerEvents: 'none',
    },
  };
});

export const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(
    theme.palette.secondary.main,
    0.1
  )} 100%)`,
  borderRadius: '50%',
  border: '2px solid',
  borderColor: theme.palette.secondary.main,
  fontSize: '1.5rem',
  position: 'relative',
  zIndex: 1,
  flexShrink: 0,
}));

export const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  position: 'relative',
  zIndex: 1,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const ActionGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  flexWrap: 'wrap',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.secondary.main,
  color: theme.palette.secondary.main,
  minWidth: 'auto',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  '&:hover': {
    borderColor: theme.palette.secondary.light,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.3s ease',
}));

export const IndicatorGroup = styled(Box)(() => ({
  display: 'flex',
  gap: 4,
  position: 'absolute',
  bottom: 8,
  right: 8,
}));

export const Indicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.secondary.main : alpha(theme.palette.secondary.main, 0.3),
  transition: 'all 0.3s ease',
}));
