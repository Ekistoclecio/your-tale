'use client';

import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

interface StyledButtonProps {
  btncolor: string;
  ended?: boolean;
  customgradient?: boolean;
}

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'btncolor' && prop !== 'ended' && prop !== 'customgradient',
})<StyledButtonProps>(({ theme, btncolor, ended, customgradient }) => {
  const defaultColor = btncolor || theme.palette.secondary.main;

  // Mapas para definir os estilos dinamicamente
  const backgroundMap: Record<string, string> = {
    default: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
    custom: `linear-gradient(135deg, ${defaultColor}, ${defaultColor}CC)`,
    ended: theme.palette.error.dark,
  };

  const borderMap: Record<string, string> = {
    default: `2px solid ${theme.palette.secondary.dark}`,
    custom: `2px solid ${defaultColor}`,
    ended: `2px solid ${theme.palette.error.main}`,
  };

  const hoverBackgroundMap: Record<string, string> = {
    default: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
    custom: `linear-gradient(135deg, ${defaultColor}DD, ${defaultColor})`,
    ended: theme.palette.error.dark,
  };

  const shadowColor = defaultColor;

  const variant = ended ? 'ended' : customgradient ? 'custom' : 'default';

  return {
    background: backgroundMap[variant],
    color: theme.palette.secondary.contrastText,
    fontWeight: 600,
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadiusLarge,
    textTransform: 'none',
    boxShadow: theme.shadowsCustom.md(shadowColor),
    border: borderMap[variant],
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      background: hoverBackgroundMap[variant],
      boxShadow: theme.shadowsCustom.lg(shadowColor),
      transform: ended ? 'none' : 'translateY(-2px)',
    },

    '&:active': {
      transform: 'translateY(0px)',
      boxShadow: theme.shadowsCustom.sm(shadowColor),
    },

    '&:disabled': {
      background: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      boxShadow: 'none',
      border: `2px solid ${theme.palette.divider}`,
      transform: 'none',
    },
  };
});
