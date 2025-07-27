'use client';

import { Typography, Tooltip, useTheme, Box, Badge } from '@mui/material';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Avatar, StatusBar, StatusIcon } from '@/components/atoms';
import { CharacterModal } from '@/components/organisms';
import * as S from './styles';

export interface Player {
  id: string;
  name: string;
  playerName: string;
  avatar?: string;
  level: number;
  class: string;
  race: string;
  hp: { current: number; max: number };
  mana?: { current: number; max: number };
  status: 'alive' | 'unconscious' | 'dead';
  position: { x: number; y: number };
  isOnline?: boolean;
  attributes: {
    strength: { value: number; modifier: number };
    dexterity: { value: number; modifier: number };
    constitution: { value: number; modifier: number };
    intelligence: { value: number; modifier: number };
    wisdom: { value: number; modifier: number };
    charisma: { value: number; modifier: number };
  };
  conditions: string[];
  appearance: string;
  backstory: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  notes: string;
  inventory: Array<{ id: string; name: string; quantity: number; description?: string }>;
}

export interface PlayerListProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  currentUserId?: string;
  userRole?: 'player' | 'master';
  onSaveCharacter?: (character: Player) => void;
}

export const PlayerList = ({
  players,
  onPlayerClick,
  currentUserId,
  userRole = 'player',
  onSaveCharacter,
}: PlayerListProps) => {
  const theme = useTheme();
  const [selectedCharacter, setSelectedCharacter] = useState<Player | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getStatusIcon = (status: Player['status']) => {
    switch (status) {
      case 'alive':
        return 'healthy';
      case 'unconscious':
        return 'unconscious';
      case 'dead':
        return 'dead';
      default:
        return 'healthy';
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedCharacter(player);
    setModalOpen(true);
    onPlayerClick?.(player);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleSaveCharacter = (updatedCharacter: Player) => {
    onSaveCharacter?.(updatedCharacter);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedCharacter(null);
    }, 1000);
  };

  return (
    <S.PlayerListContainer elevation={0}>
      {/* Header */}
      <S.HeaderWrapper>
        <S.HeaderTitleWrapper>
          <S.HeaderTitle variant="h6">Jogadores</S.HeaderTitle>
          <S.PlayerCount>{players.length}</S.PlayerCount>
        </S.HeaderTitleWrapper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <S.StatusTag type="online">
            <span />
            <p>
              <b>{players.length}</b> ONLINE
            </p>
          </S.StatusTag>

          <S.StatusTag type="offline">
            <span />
            <p>
              <b>{players.length}</b> OFFLINE
            </p>
          </S.StatusTag>
        </Box>
      </S.HeaderWrapper>

      {/* Lista de Jogadores */}
      <S.ScrollArea>
        <AnimatePresence>
          {players.map((player, index) => (
            <S.PlayerItem
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handlePlayerClick(player)}
              sx={{
                ...(player.id === currentUserId && {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: `${theme.palette.secondary.main}15`,
                }),
                ...(player.isOnline === false && { opacity: 0.6, filter: 'grayscale(30%)' }),
              }}
            >
              <Badge
                color={player.isOnline === false ? 'error' : 'success'}
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-dot': { width: 12, height: 12 },
                }}
              >
                <Avatar
                  src={player.avatar}
                  alt={player.name}
                  sx={{ width: 40, height: 40 }}
                  animationVariant="subtleBounce"
                />
              </Badge>

              <Box sx={{ maxWidth: '100%', width: '100%', overflow: 'hidden' }}>
                <S.PlayerInfo>
                  <Tooltip title={`${player.name} (${player.playerName})`} placement="right" arrow>
                    <S.PlayerName>{player.name}</S.PlayerName>
                  </Tooltip>
                </S.PlayerInfo>

                <S.StatsContainer>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <StatusIcon
                      status={getStatusIcon(player.status)}
                      size="small"
                      tooltip={`Status: ${player.status}`}
                    />
                    <StatusBar
                      current={player.hp.current}
                      max={player.hp.max}
                      type="hp"
                      size="small"
                      showNumbers
                      animated={false}
                    />
                  </Box>

                  {player.mana && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <StatusIcon
                        status="mana"
                        size="small"
                        tooltip={`Mana: ${player.mana.current}/${player.mana.max}`}
                      />
                      <StatusBar
                        current={player.mana.current}
                        max={player.mana.max}
                        type="mana"
                        size="small"
                        showNumbers
                        animated={false}
                      />
                    </Box>
                  )}
                </S.StatsContainer>
              </Box>

              <S.StatusContainer />
            </S.PlayerItem>
          ))}
        </AnimatePresence>

        {players.length === 0 && (
          <S.EmptyState>
            <Typography variant="body2">Nenhum jogador conectado</Typography>
          </S.EmptyState>
        )}
      </S.ScrollArea>

      {/* Modal */}
      <CharacterModal
        open={modalOpen}
        onClose={handleModalClose}
        character={selectedCharacter}
        currentUserId={currentUserId || ''}
        userRole={userRole}
        onSave={(character) => handleSaveCharacter(character as Player)}
      />
    </S.PlayerListContainer>
  );
};
