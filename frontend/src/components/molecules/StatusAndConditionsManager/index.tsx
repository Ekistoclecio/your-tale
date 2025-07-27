import { Box, Typography, Button, Chip, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import { DeleteRounded as DeleteIcon, AddRounded as AddIcon } from '@mui/icons-material';
import * as S from './styles';

export const StatusAndConditionsManager = ({
  conditions,
  onAddCondition,
  onRemoveCondition,
  canEdit,
}: {
  conditions: string[];
  onAddCondition: (condition: string) => void;
  onRemoveCondition: (condition: string) => void;
  canEdit: boolean;
}) => {
  const theme = useTheme();
  const [newCondition, setNewCondition] = useState('');

  const commonConditions = [
    'Envenenado',
    'Paralisado',
    'Cego',
    'Surdo',
    'Assustado',
    'Agarrado',
    'Incapacitado',
    'Invisível',
    'Petrificado',
    'Propenso',
    'Impedido',
    'Atordoado',
    'Inconsciente',
    'Exausto',
    'Charmed',
    'Concentrando',
  ];

  const handleAddCondition = (condition: string) => {
    if (condition.trim() && !conditions.includes(condition.trim())) {
      onAddCondition(condition.trim());
      setNewCondition('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddCondition(newCondition);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.primary }}>
        Condições Ativas:
      </Typography>

      <Box sx={{ mb: 2, minHeight: 40 }}>
        {conditions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Nenhuma condição ativa
          </Typography>
        ) : (
          conditions.map((condition, index) => (
            <S.StatusChip
              key={index}
              label={condition}
              onDelete={canEdit ? () => onRemoveCondition(condition) : undefined}
              deleteIcon={<DeleteIcon />}
            />
          ))
        )}
      </Box>

      {canEdit && (
        <>
          <S.AddConditionContainer>
            <TextField
              size="small"
              label="Nova condição"
              placeholder="Digite uma condição..."
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleAddCondition(newCondition)}
              disabled={!newCondition.trim()}
              startIcon={<AddIcon />}
              size="small"
            >
              Adicionar
            </Button>
          </S.AddConditionContainer>

          <S.CommonConditionsContainer>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Condições Comuns (clique para adicionar):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {commonConditions
                .filter((c) => !conditions.includes(c))
                .map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    onClick={() => handleAddCondition(c)}
                    variant="outlined"
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: `${theme.palette.secondary.main}20`,
                        borderColor: theme.palette.secondary.main,
                      },
                    }}
                  />
                ))}
            </Box>
          </S.CommonConditionsContainer>
        </>
      )}
    </Box>
  );
};
