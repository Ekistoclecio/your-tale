'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, TextField } from '@mui/material';
import { MotionTypography } from '@/components/atoms/MotionTypography';
import { MotionBox } from '@/components/atoms/MotionBox';
import { MotionButton } from '@/components/atoms/MotionButton';
import { SignInFormData, signInSchema } from '@/schemas/form-validation/signInForm';

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    // TODO: Implementar lógica de autenticação
    console.log('Login attempt:', data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <MotionTypography variant="h3" align="center">
          Entrar
        </MotionTypography>
        <Stack spacing={2}>
          <MotionBox whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
            <TextField
              label="E-mail"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              fullWidth
            />
          </MotionBox>

          <MotionBox whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
            <TextField
              label="Senha"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              fullWidth
            />
          </MotionBox>
        </Stack>

        <Stack spacing={3}>
          {/* TODO: Implementar link de recuperação de senha */}
          {/* <Link href="/forgot-password" alignSelf="flex-end">
            <MotionTypography variant="body1">Esqueceu sua senha?</MotionTypography>
          </Link> */}

          <MotionButton
            animationVariant="subtleBounce"
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 8 }}
          >
            Entrar
          </MotionButton>
        </Stack>
      </Stack>
    </Box>
  );
};
