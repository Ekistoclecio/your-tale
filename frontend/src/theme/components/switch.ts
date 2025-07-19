import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const SwitchOverrides: Components['MuiSwitch'] = {
  styleOverrides: {
    root: {
      padding: 8,
    },
    switchBase: {
      '&.Mui-checked': {
        color: baseTheme.palette.secondary.main,
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: baseTheme.palette.action.disabledBackground,
        },
      },
      '&:not(.Mui-checked)': {
        color: baseTheme.palette.text.disabled,
        '& + .MuiSwitch-track': {
          backgroundColor: baseTheme.palette.action.disabledBackground,
          opacity: 1,
        },
      },
    },
    track: {
      borderRadius: 14,
      opacity: 1,
      backgroundColor: baseTheme.palette.action.disabledBackground,
    },
    thumb: {
      boxShadow: 'none',
    },
  },
};
