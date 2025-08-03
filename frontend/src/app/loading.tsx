'use client';

import { Box } from '@mui/material';
import Loading from '@/components/molecules/Loading';

export default function LoadingPage() {
  return (
    <Box width="100vw" height="100vh">
      <Loading message="Preparando sua aventura..." showLogo={true} size="medium" />
    </Box>
  );
}
