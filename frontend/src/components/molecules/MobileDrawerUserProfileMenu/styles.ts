import { Drawer as MuiDrawer, ListItemText, styled } from '@mui/material';

export const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': { boxSizing: 'border-box' },
  display: 'block',

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const DrawerPaper = styled('div')(({ theme }) => ({
  width: 280,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  borderRight: `2px solid ${theme.palette.secondary.main}`,
  height: '100%',
  paddingTop: theme.spacing(2),
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontFamily: 'var(--font-cinzel)',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));
