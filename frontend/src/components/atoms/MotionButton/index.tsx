import { forwardRef } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { animationVariants } from '@/constants/animation';

interface MotionButtonProps extends ButtonProps {
  animationVariant?: 'none' | 'subtleBounce';
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ animationVariant = 'none', ...props }, ref) => (
    <Button
      component={motion.button}
      ref={ref}
      {...animationVariants[animationVariant]}
      {...props}
    />
  )
);

MotionButton.displayName = 'MotionButton';
