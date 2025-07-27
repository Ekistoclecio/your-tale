import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const CircularProgressOverrides: Components['MuiCircularProgress'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text.primary,
    },
  },
};
