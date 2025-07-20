'use client';
import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { components } from '@/theme/components';
import { baseTheme } from '@/theme/base';

// Estende com componentes + aplica responsividade
export const theme: Theme = responsiveFontSizes(
  createTheme(baseTheme, {
    components,
  })
);
