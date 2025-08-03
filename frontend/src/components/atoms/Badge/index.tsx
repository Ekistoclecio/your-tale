'use client';

import { BadgeVariants } from '@/components/atoms/Badge/variants';
import { Box, Chip, ChipProps, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface CustomBadgeProps extends ChipProps {
  badgeVariant?: 'active' | 'ended' | 'not_started' | 'ai' | 'human';
  whileHover?: object;
}

export const Badge = ({
  badgeVariant = 'active',
  whileHover = { scale: 1.05, transition: { duration: 0.1 } },
  ...props
}: CustomBadgeProps) => {
  const config = BadgeVariants[badgeVariant];
  const Icon = config.icon;
  return (
    <Chip
      component={motion.div}
      whileHover={whileHover}
      label={
        <Box display="flex" alignItems="center" gap={2}>
          <Icon width={20} height={20} />
          <Typography variant="button" textTransform={'none'}>
            {config.label}
          </Typography>
        </Box>
      }
      color={config.color}
      size="small"
      sx={{ padding: '1.4rem 0.5rem' }}
      {...props}
    />
  );
};
