import { Typography, TypographyProps } from '@mui/material';
import { motion } from 'framer-motion';

interface MotionTypographyProps extends TypographyProps {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
}

export const MotionTypography = ({
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { delay: 0.2 },
  exit,
  ...props
}: MotionTypographyProps) => {
  return (
    <Typography
      component={motion.p}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    />
  );
};
