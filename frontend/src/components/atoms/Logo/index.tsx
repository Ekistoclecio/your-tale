'use client';

import { Box, BoxProps } from '@mui/material';

interface LogoProps extends BoxProps {
  variant?: 'horizontal' | 'vertical';
  theme?: 'light' | 'dark';
  width?: number | BoxProps['width'];
  height?: number | BoxProps['height'];
}

export default function Logo({
  variant = 'horizontal',
  theme = 'dark',
  width = 200,
  height = 60,
  sx,
  ...props
}: LogoProps) {
  const logoSrc = `/${variant}Logo${theme === 'light' ? 'Light' : 'Dark'}.svg`;

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        minWidth: 120,
        minHeight: 36,
        backgroundImage: `url(${logoSrc})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    />
  );
}
