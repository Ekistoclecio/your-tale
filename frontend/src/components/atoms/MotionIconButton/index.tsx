import { IconButton, IconButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

interface MotionIconButtonProps extends IconButtonProps {
  whileHover?: object;
  whileTap?: object;
}

export const MotionIconButton = ({
  whileHover = { scale: 1.02, transition: { duration: 0.1 } },
  whileTap = { scale: 0.98, transition: { duration: 0.1 } },
  ...props
}: MotionIconButtonProps) => (
  <IconButton component={motion.button} whileHover={whileHover} whileTap={whileTap} {...props} />
);
