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
            <Logo
              width={{
                xs: 150,
                sm: 180,
                md: 220,
              }}
              height={{
                xs: 45,
                sm: 54,
                md: 66,
              }}
              alignSelf="center"
            />
            {children}
          </Stack>
        </S.Card>
      </Box>
    </S.Root>
  );
};
