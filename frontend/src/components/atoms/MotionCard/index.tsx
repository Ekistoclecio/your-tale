'use client';

import { cardStyleVariants } from '@/components/atoms/MotionCard/styleVariants';
import { animationVariants } from '@/constants/animation';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface MotionCardProps extends Omit<CardProps, 'variant'> {
  cardVariant?: 'default' | 'session';
  animationVariant?: 'none' | 'subtleBounce';
}

export const MotionCard = ({
  animationVariant = 'none',
  cardVariant = 'default',
  sx,
  ...props
}: MotionCardProps) => {
  return (
    <Card
      component={motion.div}
      {...animationVariants[animationVariant]}
      sx={{
        ...cardStyleVariants[cardVariant],
        ...sx,
      }}
      {...props}
    />
  );
};
