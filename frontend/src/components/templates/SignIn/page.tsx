'use client';

import { motion } from 'framer-motion';
import { Box, Stack, Link as MuiLink } from '@mui/material';
import Logo from '@/components/atoms/Logo';
import * as S from './styles';
import { MotionTypography } from '@/components/atoms/MotionTypography';
import { SocialSignInOptions } from '@/components/organisms/SocialSignInOptions';
import { SignInForm } from '@/components/organisms/SignInForm';

export default function SignInTemplate() {
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
            <SignInForm />
            <SocialSignInOptions />
            <MotionTypography color="text.secondary" textAlign="center">
              Novo por aqui? <MuiLink href="/sign-up">Crie uma conta</MuiLink>
            </MotionTypography>
          </Stack>
        </S.Card>
      </Box>
    </S.Root>
  );
}
