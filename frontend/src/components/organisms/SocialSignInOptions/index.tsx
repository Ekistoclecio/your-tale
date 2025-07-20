import { Box, Divider, Stack } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { MotionIconButton } from '@/components/atoms/MotionIconButton';
import { MotionTypography } from '@/components/atoms/MotionTypography';

export const SocialSignInOptions = () => {
  return (
    <Stack spacing={2}>
      <Box position="relative">
        <Divider>
          <MotionTypography color="text.secondary">ou entre com</MotionTypography>
        </Divider>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center">
        <MotionIconButton size="large" color="primary">
          <GoogleIcon />
        </MotionIconButton>
      </Stack>
    </Stack>
  );
};
