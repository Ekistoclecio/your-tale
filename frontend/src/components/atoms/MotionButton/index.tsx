import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

interface MotionButtonProps extends ButtonProps {
  whileHover?: object;
  whileTap?: object;
}

export const MotionButton = ({
  whileHover = { scale: 1.02, transition: { duration: 0.1 } },
  whileTap = { scale: 0.98, transition: { duration: 0.1 } },
  ...props
}: MotionButtonProps) => (
  <Button component={motion.button} whileHover={whileHover} whileTap={whileTap} {...props} />
);
