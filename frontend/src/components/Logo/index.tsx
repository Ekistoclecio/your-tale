'use client';

import { Box, BoxProps } from '@mui/material';

interface LogoProps extends BoxProps {
  variant?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
}

export default function Logo({
  variant = 'horizontal',
  width = 200,
  height = 60,
  sx,
  ...props
}: LogoProps) {
  const logoSrc = `/${variant}Logo.svg`;

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        backgroundImage: `url(${logoSrc})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...sx,
      }}
      {...props}
    />
  );
}
