import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { animationVariants } from '@/constants/animation';

interface MotionButtonProps extends ButtonProps {
  animationVariant?: 'none' | 'subtleBounce';
}

export const MotionButton = ({ animationVariant = 'none', ...props }: MotionButtonProps) => (
  <Button component={motion.button} {...animationVariants[animationVariant]} {...props} />
);
