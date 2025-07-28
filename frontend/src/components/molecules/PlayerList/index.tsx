'use client';

import { Typography, Tooltip, useTheme, Box, Badge } from '@mui/material';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Avatar, StatusBar, StatusIcon } from '@/components/atoms';
import { CharacterModal } from '@/components/organisms';
import * as S from './styles';
import { Character } from '@/schemas/entities/character';
import { useUpdateCharacter } from '@/queries/character/mutation';
import { useSnackbar } from 'notistack';

export interface PlayerListProps {
  players: Character[];
  onPlayerClick?: (player: Character) => void;
  currentUserId?: string;
  userRole?: 'player' | 'master';
  onSaveCharacter?: (character: Character) => void;
}

export const PlayerList = ({
  players,
  onPlayerClick,
  currentUserId,
  userRole = 'player',
  onSaveCharacter,
}: PlayerListProps) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { mutateAsync: updateCharacter } = useUpdateCharacter();

  const getStatusIcon = (status: Character['status']) => {
    if(status.hitPoints.current > 0) {
      return 'healthy';
    }
    if(status.hitPoints.current <= 0) {
      return 'dead';
    }
    return 'healthy';
  };

  const handlePlayerClick = (player: Character) => {
    setSelectedCharacter(player);
    setModalOpen(true);
    onPlayerClick?.(player);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleSaveCharacter = async (updatedCharacter: Character) => {
    try {
      await updateCharacter(updatedCharacter);
      onSaveCharacter?.(updatedCharacter);
      setModalOpen(false);
      setSelectedCharacter(null);
      enqueueSnackbar('Personagem atualizado com sucesso', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Erro ao atualizar personagem', { variant: 'error' });
    }
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
                ...(player.status.hitPoints.current <= 0 && { opacity: 0.6, filter: 'grayscale(30%)' }),
              }}
            >
              <Badge
                color={player.status.hitPoints.current <= 0 ? 'error' : 'success'}
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-dot': { width: 12, height: 12 },
                }}
              >
                <Avatar
                  src={player.character_sheet.avatar as string}
                  alt={player.name}
                  sx={{ width: 40, height: 40 }}
                  animationVariant="subtleBounce"
                />
              </Badge>

              <Box sx={{ maxWidth: '100%', width: '100%', overflow: 'hidden' }}>
                <S.PlayerInfo>
                  <Tooltip title={`${player.name} (${player.character_sheet.playerName})`} placement="right" arrow>
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
                      current={player.status.hitPoints.current}
                      max={player.status.hitPoints.maximum}
                      type="hp"
                      size="small"
                      showNumbers
                      animated={false}
                    />
                  </Box>

                  {Boolean(player.status.mana) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <StatusIcon
                        status="mana"
                        size="small"
                        tooltip={`Mana: ${player.status.mana.current}/${player.status.mana.maximum}`}
                      />
                      <StatusBar
                        current={player.status.mana.current}
                        max={player.status.mana.maximum}
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
        onSave={handleSaveCharacter}
      />
    </S.PlayerListContainer>
  );
};
