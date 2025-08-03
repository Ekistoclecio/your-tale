import { Box, Grid, Typography, Divider, TextField } from '@mui/material';
import { BackstoryEditor } from '@/components/molecules';
import { alpha, useTheme } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

export const TraitsAndAbilitiesForm = () => {
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
      <Grid container spacing={3}>
        {/* Características Raciais */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Diversity3Icon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Características Raciais
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Habilidades inatas da raça do seu personagem
          </Typography>

          <TextField
            {...register('character_sheet.racialTraits')}
            label="Características Raciais"
            placeholder="Ex: Visão no Escuro (60 pés), Resistência ao Veneno, Anfíbio, Ferramentas de Artesão..."
            multiline
            rows={4}
            helperText="Liste as características especiais da raça do seu personagem"
          />
        </Grid>

        {/* Características de Classe */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MilitaryTechIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Características de Classe
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Habilidades e recursos da classe do seu personagem
          </Typography>

          <TextField
            {...register('character_sheet.classFeatures')}
            label="Características de Classe"
            placeholder="Ex: Defesa de Combate, Ataque Extra, Magia de Classe, Especialização em Arma..."
            multiline
            rows={4}
            helperText="Descreva as características especiais da classe do seu personagem"
          />
        </Grid>

        {/* Talentos */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WorkspacePremiumIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Talentos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Talentos especiais escolhidos pelo jogador
          </Typography>

          <TextField
            {...register('character_sheet.feats')}
            label="Talentos"
            placeholder="Ex: Atirador de Elite, Mestre de Armas, Observador, Resiliente..."
            multiline
            rows={3}
            helperText="Liste os talentos que seu personagem possui"
          />
        </Grid>

        {/* Habilidades Especiais */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AutoFixHighIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Habilidades Especiais
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Outras habilidades únicas do personagem
          </Typography>

          <TextField
            {...register('character_sheet.specialAbilities')}
            label="Habilidades Especiais"
            placeholder="Ex: Telepatia, Transformação, Habilidade de Voo, Regeneração..."
            multiline
            rows={3}
            helperText="Descreva habilidades especiais não cobertas por raça ou classe"
          />
        </Grid>

        {/* Condições e Efeitos */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WarningAmberIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Condições e Efeitos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Condições especiais, maldições, bênçãos ou efeitos mágicos
          </Typography>

          <TextField
            {...register('character_sheet.conditions')}
            label="Condições e Efeitos"
            placeholder="Ex: Bênção de um deus, Maldição antiga, Efeito de poção permanente..."
            multiline
            rows={3}
            helperText="Liste condições especiais que afetam o personagem"
          />
        </Grid>

        {/* Anotações Gerais */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <StickyNote2Icon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Anotações Gerais
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Informações adicionais sobre habilidades, características ou observações importantes
          </Typography>

          <BackstoryEditor name="character_sheet.traitsNotes" label="Anotações" maxLength={2000} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Dica:</strong> Consulte o Manual do Jogador para detalhes completos sobre
          características raciais e de classe. Algumas habilidades podem ter pré-requisitos ou
          limitações específicas.
        </Typography>
      </Box>
    </Box>
  );
};

TraitsAndAbilitiesForm.displayName = 'TraitsAndAbilitiesForm';
