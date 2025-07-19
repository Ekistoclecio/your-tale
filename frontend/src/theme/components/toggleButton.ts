import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const ToggleButtonOverrides: Components['MuiToggleButton'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text.disabled, // cor padrão (não selecionado)
      borderColor: baseTheme.palette.divider,

      '&.Mui-selected': {
        color: baseTheme.palette.secondary.main,
        borderColor: baseTheme.palette.secondary.main,
        backgroundColor: 'transparent', // evita preenchimento se não quiser
      },
    },
  },
};
