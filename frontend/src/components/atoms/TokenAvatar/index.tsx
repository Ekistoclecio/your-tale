'use client';

import { Badge, Tooltip } from '@mui/material';
import * as S from './styles';

interface TokenAvatarProps {
  src?: string;
  alt: string;
  size?: number;
  status?: 'alive' | 'unconscious' | 'dead';
  isDraggable?: boolean;
  position?: { x: number; y: number };
  onDrag?: (position: { x: number; y: number }) => void;
  tooltip?: string;
}

export const TokenAvatar = ({
  src,
  alt,
  size = 48,
  status = 'alive',
  isDraggable = false,
  position = { x: 0, y: 0 },
  onDrag,
  tooltip,
}: TokenAvatarProps) => {
  const getStatusBadge = () => {
    if (status === 'unconscious') return { color: 'warning', content: '💤' };
    if (status === 'dead') return { color: 'error', content: '💀' };
    return null;
  };

  const statusBadge = getStatusBadge();

  const tokenElement = (
    <S.TokenContainer
      drag={isDraggable}
      dragMomentum={false}
      onDragEnd={(event, info) => {
        if (onDrag && isDraggable) {
          const newPosition = {
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          };
          onDrag(newPosition);
        }
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        left: position.x,
        top: position.y,
        position: 'absolute',
        cursor: isDraggable ? 'grab' : 'default',
      }}
    >
      <Badge
        badgeContent={statusBadge?.content}
        color={
          statusBadge?.color as
            | 'default'
            | 'primary'
            | 'secondary'
            | 'error'
            | 'info'
            | 'success'
            | 'warning'
        }
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.75rem',
            minWidth: 20,
            height: 20,
          },
        }}
      >
        <S.TokenAvatarImage
          src={src}
          alt={alt}
          sx={{
            width: size,
            height: size,
            opacity: status === 'dead' ? 0.6 : 1,
            filter: status === 'unconscious' ? 'grayscale(50%)' : 'none',
          }}
        />
      </Badge>
    </S.TokenContainer>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      {tokenElement}
    </Tooltip>
  ) : (
    tokenElement
  );
};
