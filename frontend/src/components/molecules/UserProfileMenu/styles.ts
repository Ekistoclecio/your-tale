import { Menu, styled } from '@mui/material';

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: `linear-gradient(135deg, ${theme.palette.background.input} 0%, ${theme.palette.primary.main} 100%)`,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadiusMedium,
    marginTop: theme.spacing(1),
  },
}));
