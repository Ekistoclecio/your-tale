'use client';

import { useState } from 'react';
import { IconButton, Toolbar } from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import Logo from '../../atoms/Logo';
import { Avatar } from '../../atoms/Avatar';
import { UserProfileMenu } from '../../molecules';
import { MobileDrawerUserProfileMenu } from '../../molecules';
import { UserProfileModal } from '@/components/organisms';
import * as S from './styles';

interface HeaderProps {
  onCreateSession: () => void;
  onEnterCode: () => void;
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const Header = ({ onCreateSession, onEnterCode, onLogout, user }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const getDisplayName = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0];
    if (names.length === 2) return fullName;
    return `${names[0]} ${names[names.length - 1]}`;
  };

  const handleSaveField = (field: 'name' | 'email', value: string) => {
    console.log('Salvando campo:', field, value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    {
      label: 'Criar nova sessão',
      icon: <AddIcon />,
      onClick: () => {
        onCreateSession();
        handleMenuClose();
        setDrawerOpen(false);
      },
    },
    {
      label: 'Entrar com código',
      icon: <VpnKeyIcon />,
      onClick: () => {
        onEnterCode();
        handleMenuClose();
        setDrawerOpen(false);
      },
    },
  ];

  const userMenuItems = [
    {
      label: 'Perfil',
      icon: <PersonIcon />,
      onClick: () => {
        setUserProfileModalOpen(true);
        handleMenuClose();
      },
    },
    {
      label: 'Sair',
      icon: <LogoutIcon />,
      onClick: () => {
        onLogout();
        handleMenuClose();
      },
    },
  ];

  return (
    <>
      <S.StyledAppBar position="fixed">
        <S.StyledToolbar>
          <S.LeftBox>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Logo variant="horizontal" theme="light" width={180} height={45} />
          </S.LeftBox>

          {user && (
            <S.UserBox>
              <S.UserName variant={'h6'}>{getDisplayName(user.name)}</S.UserName>

              <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 } }}
                  animationVariant="subtleBounce"
                />
              </IconButton>
            </S.UserBox>
          )}
        </S.StyledToolbar>
      </S.StyledAppBar>

      <MobileDrawerUserProfileMenu
        open={drawerOpen}
        onClose={handleDrawerToggle}
        navItems={menuItems}
        userItems={userMenuItems}
        userName={user?.name}
      />

      <UserProfileMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        userMenuItems={userMenuItems}
      />

      <Toolbar />

      <UserProfileModal
        open={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
        user={user!}
        onSaveField={handleSaveField}
        loading={false}
      />
    </>
  );
};
