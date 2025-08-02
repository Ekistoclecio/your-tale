'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { MotionBox } from '@/components/atoms/MotionBox';
import { MotionButton } from '@/components/atoms/MotionButton';
import { SignUpFormData, signUpSchema } from '@/schemas/form-validation/signUpForm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/queries/auth/mutation';

export const SignUpForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: createUser, isPending } = useCreateUser();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await createUser(newUser);
      enqueueSnackbar('Conta criada com sucesso', {
        variant: 'success',
      });
      router.push('/sign-in');
    } catch (error) {
      console.error('Error creating user:', error);
      enqueueSnackbar('Erro ao criar conta', {
        variant: 'error',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Typography variant="h3" align="center">
          Criar conta
        </Typography>
        <Stack spacing={4}>
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
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={24} /> : 'Criar conta'}
        </MotionButton>
      </Stack>
    </Box>
  );
};
