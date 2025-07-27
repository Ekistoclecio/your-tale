'use client';

import { Tooltip, useTheme } from '@mui/material';
import {
  FavoriteRounded as HealthyIcon,
  LocalHospitalRounded as InjuredIcon,
  HotelRounded as UnconsciousIcon,
  ClearRounded as DeadIcon,
  FlashOnRounded as BuffedIcon,
  FlashOffRounded as DebuffedIcon,
  Shield as ArmoredIcon,
  Visibility as StealthIcon,
  WaterDrop as ManaIcon,
} from '@mui/icons-material';
import * as S from './styles';

export type StatusType =
  | 'healthy'
  | 'injured'
  | 'unconscious'
  | 'dead'
  | 'buffed'
  | 'debuffed'
  | 'armored'
  | 'stealth'
  | 'mana';

export interface StatusIconProps {
  status: StatusType;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  animated?: boolean;
}

export const StatusIcon = ({
  status,
  size = 'medium',
  tooltip,
  animated = true,
}: StatusIconProps) => {
  const theme = useTheme();

  const iconSizes = { small: 16, medium: 24, large: 32 };
  const iconSize = iconSizes[size];

  const statusConfig: Record<
    StatusType,
    { icon: React.ReactNode; color: string; bgColor: string }
  > = {
    healthy: {
      icon: <HealthyIcon />,
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}20`,
    },
    injured: {
      icon: <InjuredIcon />,
      color: theme.palette.warning.main,
      bgColor: `${theme.palette.warning.main}20`,
    },
    unconscious: {
      icon: <UnconsciousIcon />,
      color: theme.palette.info.main,
      bgColor: `${theme.palette.info.main}20`,
    },
    dead: {
      icon: <DeadIcon />,
      color: theme.palette.error.main,
      bgColor: `${theme.palette.error.main}20`,
    },
    buffed: {
      icon: <BuffedIcon />,
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}20`,
    },
    debuffed: {
      icon: <DebuffedIcon />,
      color: theme.palette.error.light,
      bgColor: `${theme.palette.error.light}20`,
    },
    armored: {
      icon: <ArmoredIcon />,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}20`,
    },
    stealth: {
      icon: <StealthIcon />,
      color: theme.palette.text.secondary,
      bgColor: `${theme.palette.text.secondary}20`,
    },
    mana: {
      icon: <ManaIcon />,
      color: theme.palette.info.main,
      bgColor: `${theme.palette.info.main}20`,
    },
  };

  const config = statusConfig[status] || {
    icon: <HealthyIcon />,
    color: theme.palette.text.primary,
    bgColor: `${theme.palette.text.primary}20`,
  };

  const iconElement = (
    <S.IconContainer
      initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={animated ? { scale: 0, opacity: 0 } : {}}
      transition={{ duration: 0.2 }}
      sx={{
        width: iconSize + 8,
        height: iconSize + 8,
        backgroundColor: config.bgColor,
        color: config.color,
        '& svg': { fontSize: iconSize },
      }}
    >
      {config.icon}
    </S.IconContainer>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      {iconElement}
    </Tooltip>
  ) : (
    iconElement
  );
};
