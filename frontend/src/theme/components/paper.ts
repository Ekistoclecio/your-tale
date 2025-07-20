import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const PaperOverrides: Components['MuiPaper'] = {
  styleOverrides: {
    root: {
      backgroundColor: baseTheme.palette.background.paper,
      color: baseTheme.palette.text.primary,
    },
  },
};
