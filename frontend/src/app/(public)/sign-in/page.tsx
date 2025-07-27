'use client';

import { MotionTypography } from '@/components/atoms/MotionTypography';
import { SignInForm } from '@/components/organisms/SignInForm';
// import { SocialSignInOptions } from '@/components/organisms/SocialSignInOptions';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { Link } from '@mui/material';

export default function SignInPage() {
  return (
    <AuthTemplate>
      <SignInForm />
      {/* <SocialSignInOptions /> */}
      <MotionTypography color="text.secondary" textAlign="center">
        Novo por aqui? <Link href="/sign-up">Crie uma conta</Link>
      </MotionTypography>
    </AuthTemplate>
  );
}
