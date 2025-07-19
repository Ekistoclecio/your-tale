import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const RadioOverrides: Components['MuiRadio'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text.disabled, // padrão desmarcado

      '&.Mui-checked': {
        color: baseTheme.palette.secondary.main,
      },

      '&.Mui-disabled': {
        color: baseTheme.palette.text.disabled,
      },
    },
  },
};
