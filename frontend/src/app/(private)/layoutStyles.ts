import { styled } from '@mui/material';

export const Wrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark} 100%)`,
}));

export const Content = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(4),
  overflow: 'auto',
  height: 'calc(100vh - 64px)', // considerando altura do Header
}));
