'use client';

import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const TypingDot = styled(motion.div)(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 2px',
}));

const TypingContainer = styled(motion.div)(({ theme }) => ({
  padding: '8px 16px',
  backgroundColor: `${theme.palette.background.paper}20`,
  borderRadius: '12px',
  margin: '4px 0',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.secondary.main}20`,
}));

interface TypingIndicatorProps {
  users: Array<{ id: string; name: string }>;
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) return null;

  const dotAnimation = {
    y: [0, -6, 0],
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <TypingContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Box display="flex" alignItems="center" gap={0.5}>
        <TypingDot animate={dotAnimation} transition={{ ...dotTransition, delay: 0 }} />
        <TypingDot animate={dotAnimation} transition={{ ...dotTransition, delay: 0.2 }} />
        <TypingDot animate={dotAnimation} transition={{ ...dotTransition, delay: 0.4 }} />
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        {users.length === 1 
          ? `${users[0].name} está digitando...`
          : users.length === 2
            ? `${users[0].name} e ${users[1].name} estão digitando...`
            : `${users[0].name} e mais ${users.length - 1} pessoas estão digitando...`
        }
      </Typography>
    </TypingContainer>
  );
}; 