'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, TextField } from '@mui/material';
import { MotionTypography } from '@/components/atoms/MotionTypography';
import { MotionBox } from '@/components/atoms/MotionBox';
import { MotionButton } from '@/components/atoms/MotionButton';
import { SignUpFormData, signUpSchema } from '@/schemas/form-validation/signUpForm';

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    // TODO: Implementar lógica de autenticação
    console.log('Sign up attempt:', data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <MotionTypography variant="h3" align="center">
          Criar conta
        </MotionTypography>
        <Stack spacing={2}>
          <MotionBox whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
            <TextField
              label="Nome"
              type="text"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              autoComplete="name"
              fullWidth
            />
          </MotionBox>

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
              autoComplete="password"
              fullWidth
            />
          </MotionBox>

          <MotionBox whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }}>
            <TextField
              label="Confirmar senha"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="confirm-password"
              fullWidth
            />
          </MotionBox>
        </Stack>
        <MotionButton
          animationVariant="subtleBounce"
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 8 }}
        >
          Criar conta
        </MotionButton>
      </Stack>
    </Box>
  );
};
