import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export const TokenContainer = styled(motion.div)(() => ({
  position: 'relative',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
  transition: 'transform 0.2s ease-in-out',
}));

export const TokenAvatarImage = styled(Avatar)(({ theme }) => ({
  border: `3px solid ${theme.palette.secondary.main}`,
  boxShadow: `0 4px 8px ${theme.palette.secondary.main}40`,
  '&:hover': {
    boxShadow: `0 0 20px ${theme.palette.secondary.main}80`,
  },
}));
