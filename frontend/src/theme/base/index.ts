'use client';
import { createTheme, Theme } from '@mui/material/styles';
import { palette } from '@/theme/base/palette';
import { typography } from '@/theme/base/typography';
import { options } from '@/theme/base/options';

export const baseTheme: Theme = createTheme({
  palette,
  typography,
  ...options,
});
