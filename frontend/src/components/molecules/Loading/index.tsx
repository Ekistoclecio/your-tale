'use client';

import { Box, Typography, TypographyVariant } from '@mui/material';
import { motion } from 'framer-motion';
import Logo from '../../atoms/Logo';
import * as S from './styles';

interface LoadingProps {
  message?: string;
  showLogo?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({
  message = 'Carregando...',
  showLogo = true,
  size = 'medium',
}: LoadingProps) {
  const sizeMap = {
    small: { logo: 120, text: 'h6' },
    medium: { logo: 200, text: 'h5' },
    large: { logo: 300, text: 'h4' },
  };

  const currentSize = sizeMap[size];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={S.container}
    >
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo
            variant="horizontal"
            theme="light"
            width={currentSize.logo}
            height={currentSize.logo * 0.5}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Typography
          variant={currentSize.text as TypographyVariant}
          color="text.primary"
          sx={S.messageText}
        >
          {message}
        </Typography>
      </motion.div>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        sx={S.dotsContainer}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            component={motion.div}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            sx={S.dot}
          />
        ))}
      </Box>
    </Box>
  );
}
