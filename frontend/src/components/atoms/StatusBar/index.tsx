'use client';

import { Typography, TypographyVariant, useTheme } from '@mui/material';
import * as S from './styles';

export interface StatusBarProps {
  current: number;
  max: number;
  label?: string;
  type?: 'hp' | 'mana' | 'custom';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showNumbers?: boolean;
  animated?: boolean;
}

export const StatusBar = ({
  current,
  max,
  label,
  type = 'hp',
  color,
  size = 'medium',
  showNumbers = true,
  animated = true,
}: StatusBarProps) => {
  const theme = useTheme();
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const getBarColor = () => {
    if (color) return color;
    switch (type) {
      case 'hp':
        return percentage > 60
          ? theme.palette.success.main
          : percentage > 30
            ? theme.palette.warning.main
            : theme.palette.error.main;
      case 'mana':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const barHeights = { small: 6, medium: 8, large: 12 };
  const barHeight = barHeights[size] || 8;

  const typographyVariants = { small: 'caption', medium: 'caption', large: 'body2' };
  const textVariant =
    (typographyVariants[size] as TypographyVariant) || ('caption' as TypographyVariant);

  const barColor = getBarColor();

  return (
    <S.BarContainer>
      {(label || showNumbers) && (
        <S.LabelContainer>
          {label && (
            <Typography variant={textVariant} color="text.secondary" fontWeight={500}>
              {label}
            </Typography>
          )}
          {showNumbers && (
            <Typography variant={textVariant} color="text.primary" fontWeight={600}>
              {current}/{max}
            </Typography>
          )}
        </S.LabelContainer>
      )}

      <S.BarTrack sx={{ height: barHeight }}>
        <S.BarFill
          fillColor={barColor}
          barHeight={barHeight}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </S.BarTrack>
    </S.BarContainer>
  );
};
