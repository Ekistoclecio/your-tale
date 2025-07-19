import { AppBar, Toolbar, Box, Typography, styled } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #5C3C5F 0%, #7A5E84 100%)',
  borderBottom: '2px solid',
  borderColor: theme.palette.secondary.main,
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  zIndex: theme.zIndex.drawer + 1,
}));

export const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
});

export const LeftBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const UserBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const UserName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: 'var(--font-cinzel)',
  fontWeight: 600,
  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
}));
