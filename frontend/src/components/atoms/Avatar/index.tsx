'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '@/constants/animation';

import { Avatar as MuiAvatar, type AvatarProps } from '@mui/material';
import defaultAvatar from '@/assets/images/adventurer.png';

interface CustomAvatarProps extends AvatarProps {
  animationVariant?: 'none' | 'subtleBounce';
}

export const Avatar = ({ animationVariant = 'none', ...props }: CustomAvatarProps) => (
  <MuiAvatar
    component={motion.div}
    {...animationVariants[animationVariant]}
    {...props}
    src={props.src || defaultAvatar.src}
  />
);
