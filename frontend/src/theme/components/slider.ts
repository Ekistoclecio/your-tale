import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const SliderOverrides: Components['MuiSlider'] = {
  styleOverrides: {
    root: {
      height: 4,
    },
    thumb: {
      color: baseTheme.palette.secondary.main,
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: `0 0 0 8px ${baseTheme.palette.secondary.main}22`, // leve brilho ao focar
      },
    },
    track: {
      color: baseTheme.palette.secondary.light,
      border: 'none',
    },
    rail: {
      color: baseTheme.palette.text.disabled,
      opacity: 1,
    },
    mark: {
      color: baseTheme.palette.text.disabled,
    },
    markLabel: {
      color: baseTheme.palette.text.disabled,
    },
  },
};
