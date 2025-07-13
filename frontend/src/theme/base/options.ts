import { ThemeOptions } from '@mui/material';

export const options: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 768,
      lg: 1280,
      xl: 1366,
    },
  },

  spacing: (factor: number) => `${factor * 4}px`,
  shape: {
    borderRadiusSmall: 4,
    borderRadius: 8,
    borderRadiusMedium: 16,
    borderRadiusLarge: 24,
    borderRadiusXLarge: 32,
    borderRadiusFull: '50%',
  },

  shadowsCustom: {
    sm: (color) => `0px 1px 3px 0px ${color}33`,
    md: (color) => `0px 2px 6px -1px ${color}40`,
    lg: (color) => `0px 4px 12px -2px ${color}55`,
    xl: (color) => `0px 8px 24px -4px ${color}66`,
    glow: (color) => `0 0 12px 2px ${color}AA`,
    inset: (color) => `inset 0 0 8px ${color}55`,
  },
};
