import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const CardOverrides: Components['MuiCard'] = {
  styleOverrides: {
    root: {
      borderRadius: baseTheme.shape.borderRadiusMedium,
      boxShadow: baseTheme.shadowsCustom.lg(baseTheme.palette.background?.card),
      backgroundColor: baseTheme.palette.background?.card,
      color: baseTheme.palette.text?.primary,
      padding: `${baseTheme.spacing(6)} ${baseTheme.spacing(8)}`,
    },
  },
};
