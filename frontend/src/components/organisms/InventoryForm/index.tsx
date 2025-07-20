import { Box, Grid, Typography, Divider, alpha, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoinInputGroup } from '@/components/molecules';
import { useFormContext } from 'react-hook-form';
import ShieldIcon from '@mui/icons-material/Shield';
import DiamondIcon from '@mui/icons-material/Diamond';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';

export const InventoryForm = () => {
  const theme = useTheme();
  const { register } = useFormContext();
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      <Grid container spacing={6}>
        {/* Moedas */}
        <Grid size={12}>
          <CoinInputGroup />
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Equipamentos */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ShieldIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Equipamentos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Liste todos os equipamentos, armas, armaduras e itens do seu personagem
          </Typography>

          <TextField
            {...register('equipment')}
            label="Equipamentos"
            placeholder="Ex: Espada longa, Armadura de couro, Mochila, Corda de 50 pés, Tochas (10), Ração de viagem (5 dias), Cantil, Kit de alquimista..."
            multiline
            rows={8}
            helperText="Descreva todos os itens que seu personagem carrega. Inclua armas, armaduras, equipamentos de aventura, itens mágicos, etc."
          />
        </Grid>

        {/* Peso e Capacidade */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('weight')}
            label="Peso Total (kgs)"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            helperText="Peso total carregado pelo personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('carryingCapacity')}
            label="Capacidade de Carga (kgs)"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            helperText="Capacidade máxima baseada na Força"
          />
        </Grid>

        {/* Itens Mágicos */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AutoFixNormalIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Itens Mágicos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Liste itens mágicos especiais e suas propriedades
          </Typography>

          <TextField
            {...register('magicItems')}
            label="Itens Mágicos"
            placeholder="Ex: Espada +1, Anel de Proteção, Poção de Cura Maior, Varinha de Detectar Magia..."
            multiline
            rows={4}
            helperText="Descreva itens mágicos, suas propriedades e como foram obtidos"
          />
        </Grid>

        {/* Tesouros e Objetos de Valor */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DiamondIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Tesouros e Objetos de Valor
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Gemas, joias, artefatos valiosos e outros tesouros
          </Typography>

          <TextField
            {...register('treasures')}
            label="Tesouros"
            placeholder="Ex: Rubi de 500 po, Estátua de jade, Pergaminho antigo, Chave misteriosa..."
            multiline
            rows={3}
            helperText="Liste objetos de valor que não são moedas"
          />
        </Grid>

        {/* Notas do Inventário */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <NoteAltIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Notas do Inventário
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Informações adicionais sobre equipamentos, origens de itens, etc.
          </Typography>

          <TextField
            {...register('inventoryNotes')}
            label="Notas"
            placeholder="Ex: A espada foi herdada do pai, a armadura foi encontrada em uma ruína antiga, o anel tem uma inscrição em élfico..."
            multiline
            rows={3}
            helperText="Histórias, origens ou detalhes especiais sobre os equipamentos"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Dica:</strong> A capacidade de carga é calculada como Força × 15 kgs. Itens
          pesados podem reduzir a velocidade de movimento. Consulte as regras de encumbrance do D&D
          5e para mais detalhes.
        </Typography>
      </Box>
    </Box>
  );
};

InventoryForm.displayName = 'InventoryForm';
