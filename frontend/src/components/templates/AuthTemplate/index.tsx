'use client';

import { motion } from 'framer-motion';
import { Box, Stack } from '@mui/material';
import Logo from '@/components/atoms/Logo';
import * as S from './styles';

export const AuthTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <S.Root>
      <Box component={motion.div} variants={S.motionCardVariant} initial="hidden" animate="visible">
        <S.Card>
          <Stack spacing={6}>
            <Logo theme="dark" width={220} height={66} alignSelf="center" />
            {children}
          </Stack>
        </S.Card>
      </Box>
    </S.Root>
  );
};
