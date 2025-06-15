'use client';

import P5Sketch from '@/components/P5Sketch';
import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box>
      <Typography variant="h1" component="h1">
        YourTale
      </Typography>
      <P5Sketch />
    </Box>
  );
}
