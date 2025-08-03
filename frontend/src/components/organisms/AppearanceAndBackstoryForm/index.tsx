import { Box, Grid, Typography, Divider, TextField } from '@mui/material';
import { BackstoryEditor } from '@/components/molecules';
import { Face } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LinkIcon from '@mui/icons-material/Link';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

export const AppearanceAndBackstoryForm = () => {
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
        {/* Aparência Física */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Face fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Aparência Física
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Descreva a aparência física do seu personagem
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.age')}
            label="Idade"
            type="number"
            slotProps={{
              htmlInput: {
                min: 1,
                max: 1000,
              },
            }}
            helperText="Idade em anos"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.height')}
            label="Altura"
            placeholder="ex: 1,75m"
            helperText="Altura do personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.weight')}
            label="Peso"
            placeholder="ex: 70kg"
            helperText="Peso do personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.eyes')}
            label="Olhos"
            placeholder="ex: Azuis brilhantes"
            helperText="Cor e características dos olhos"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.skin')}
            label="Pele"
            placeholder="ex: Bronzeada"
            helperText="Cor e textura da pele"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.hair')}
            label="Cabelo"
            placeholder="ex: Loiro longo"
            helperText="Cor, estilo e características do cabelo"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.distinguishingFeatures')}
            label="Características Distintivas"
            placeholder="ex: Cicatriz no rosto"
            helperText="Marcas, cicatrizes, tatuagens, etc."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            {...register('character_sheet.appearance.clothing')}
            label="Vestimentas"
            placeholder="ex: Túnica de viajante"
            helperText="Estilo de roupa preferido"
          />
        </Grid>

        {/* Descrição Geral da Aparência */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FaceRetouchingNaturalIcon
              fontSize="medium"
              sx={{ color: theme.palette.secondary.light }}
            />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Descrição Geral da Aparência
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Uma descrição mais detalhada da aparência física
          </Typography>

          <TextField
            {...register('character_sheet.appearance.description')}
            label="Descrição da Aparência"
            placeholder="Descreva como seu personagem se parece, incluindo postura, expressões faciais, gestos característicos, etc."
            multiline
            rows={4}
            helperText="Uma descrição completa da aparência física do personagem"
          />
        </Grid>

        {/* História Pessoal */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MenuBookIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              História Pessoal
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A história de vida do seu personagem
          </Typography>

          <BackstoryEditor
            name="character_sheet.backstory"
            label="História do Personagem"
            maxLength={3000}
          />
        </Grid>

        {/* Personalidade */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PsychologyIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Personalidade
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Traços de personalidade, manias, medos e aspirações
          </Typography>

          <TextField
            {...register('character_sheet.personality')}
            label="Personalidade"
            placeholder="Descreva como seu personagem age, pensa e se comporta. Inclua traços de personalidade, manias, medos, aspirações, etc."
            multiline
            rows={4}
            helperText="Como o personagem se comporta e interage com o mundo"
          />
        </Grid>

        {/* Ideais, Vínculos e Defeitos */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LightbulbIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Ideais
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            O que motiva seu personagem
          </Typography>

          <TextField
            {...register('character_sheet.ideals')}
            label="Ideais"
            placeholder="ex: Justiça, Liberdade, Conhecimento, Poder..."
            multiline
            rows={3}
            helperText="Os valores e crenças que guiam o personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LinkIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Vínculos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Conexões emocionais importantes
          </Typography>

          <TextField
            {...register('character_sheet.bonds')}
            label="Vínculos"
            placeholder="ex: Família, Mentor, Local sagrado, Objeto precioso..."
            multiline
            rows={3}
            helperText="Pessoas, lugares ou objetos importantes para o personagem"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReportProblemIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Defeitos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fraquezas e falhas de caráter
          </Typography>

          <TextField
            {...register('character_sheet.flaws')}
            label="Defeitos"
            placeholder="ex: Orgulho excessivo, Medo de altura, Vício em jogos..."
            multiline
            rows={3}
            helperText="Fraquezas e defeitos que tornam o personagem mais humano"
          />
        </Grid>

        {/* Notas Adicionais */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <StickyNote2Icon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Notas Adicionais
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Informações adicionais sobre a história ou aparência
          </Typography>

          <TextField
            {...register('character_sheet.additionalNotes')}
            label="Notas Adicionais"
            placeholder="Qualquer informação adicional sobre a história, aparência ou desenvolvimento do personagem"
            multiline
            rows={3}
            helperText="Observações, detalhes ou informações extras"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Dica:</strong> Uma história bem desenvolvida ajuda a dar vida ao seu personagem e
          pode inspirar momentos memoráveis na mesa. Considere como a história se conecta com a
          classe, raça e antecedente escolhidos.
        </Typography>
      </Box>
    </Box>
  );
};

AppearanceAndBackstoryForm.displayName = 'AppearanceAndBackstoryForm';
