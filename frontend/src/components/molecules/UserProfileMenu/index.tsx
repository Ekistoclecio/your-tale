'use client';

import { Box, MenuItem } from '@mui/material';
import React from 'react';
import * as S from './styles';

interface UserMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface UserProfileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  userMenuItems: UserMenuItem[];
}

export const UserProfileMenu = ({ anchorEl, onClose, userMenuItems }: UserProfileMenuProps) => {
  const open = Boolean(anchorEl);

  return (
    <S.StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {userMenuItems.map((item) => (
        <MenuItem key={item.label} onClick={item.onClick}>
          <Box display="flex" alignItems="center" gap={1}>
            {item.icon}
            {item.label}
          </Box>
        </MenuItem>
      ))}
    </S.StyledMenu>
  );
};
