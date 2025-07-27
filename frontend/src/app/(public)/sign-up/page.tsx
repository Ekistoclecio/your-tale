'use client';

import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { SignUpForm } from '@/components/organisms/SignUpForm';
import { MotionTypography } from '@/components/atoms/MotionTypography';
import { Link } from '@mui/material';

export default function SignUpPage() {
  return (
    <AuthTemplate>
      <SignUpForm />
      <MotionTypography color="text.secondary" textAlign="center">
        Já possui uma conta? <Link href="/sign-in">Entrar</Link>
      </MotionTypography>
    </AuthTemplate>
  );
}
