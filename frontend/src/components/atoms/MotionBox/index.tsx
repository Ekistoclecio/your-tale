import { Box, BoxProps } from '@mui/material';
import { motion } from 'framer-motion';

interface MotionBoxProps extends BoxProps {
  whileHover?: object;
  whileTap?: object;
  whileFocus?: object;
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
}

export const MotionBox = ({
  whileHover = { scale: 1.02 },
  whileFocus = { scale: 1.02 },
  whileTap,
  initial,
  animate,
  exit,
  transition,
  ...props
}: MotionBoxProps) => (
  <Box
    component={motion.div}
    whileHover={whileHover}
    whileFocus={whileFocus}
    whileTap={whileTap}
    initial={initial}
    animate={animate}
    exit={exit}
    transition={transition}
    {...props}
  />
);
