'use client';

import { Box, List, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import Logo from '@/components/atoms/Logo';
import React from 'react';
import * as S from './styles';

interface DrawerItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface MobileDrawerUserProfileMenuProps {
  open: boolean;
  onClose: () => void;
  navItems: DrawerItem[];
  userItems?: DrawerItem[];
  userName?: string;
}

export const MobileDrawerUserProfileMenu = ({
  open,
  onClose,
  navItems,
  userItems = [],
  userName,
}: MobileDrawerUserProfileMenuProps) => {
  return (
    <S.Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}>
      <S.DrawerPaper>
        <Box px={2} mb={3}>
          <Logo variant="horizontal" theme="light" width={200} height={50} />
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <S.StyledListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {userName && userItems.length > 0 && (
          <>
            <Box px={2} py={1} borderTop={1} borderColor="divider" mt={2}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Usuário
              </Typography>
            </Box>

            <List>
              {userItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton onClick={item.onClick}>
                    <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                    <S.StyledListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </S.DrawerPaper>
    </S.Drawer>
  );
};
