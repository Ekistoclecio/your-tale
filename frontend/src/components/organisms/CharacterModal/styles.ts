import { styled, alpha } from '@mui/material/styles';
import { Modal, Box, Typography, Grid, Accordion, AccordionSummary, Button } from '@mui/material';
import { MotionCard } from '@/components/atoms';

// Container principal do modal
export const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

// Conteúdo do modal
export const ModalContent = styled(MotionCard)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #1A141F 0%, #2B1F33 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  width: '90vw',
  maxWidth: '1200px',
  maxHeight: '90vh',
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  padding: theme.spacing(1),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

// Cabeçalho
export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: `${theme.palette.background.header}80`,
}));

export const CharacterAvatar = styled(Box)(() => ({
  position: 'relative',
  '&:hover .avatar-edit-overlay': { opacity: 1 },
}));

export const AvatarEditOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.6),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  cursor: 'pointer',
}));

export const CharacterInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const CharacterName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: '2rem',
  textShadow: `0 2px 4px ${theme.palette.common.black}40`,
  [theme.breakpoints.down('md')]: { fontSize: '1.5rem' },
}));

export const BasicInfoGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Conteúdo com scrollbar customizada
export const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': { width: 8 },
  '&::-webkit-scrollbar-track': {
    background: `${theme.palette.background.input}50`,
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.secondary.main,
    borderRadius: 4,
    '&:hover': { background: theme.palette.secondary.dark },
  },
}));

// Seções do Accordion
export const SectionContainer = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#2F2138',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: theme.shape.borderRadiusMedium,
  margin: theme.spacing(1, 0),
  '&:before': { display: 'none' },
  '&.Mui-expanded': { borderColor: theme.palette.secondary.main },
}));

export const SectionHeader = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}15`,
  borderRadius: theme.shape.borderRadiusSmall,
  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: theme.spacing(1) },
  '&.Mui-expanded': { backgroundColor: `${theme.palette.secondary.main}20` },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  color: theme.palette.secondary.main,
  fontWeight: 600,
}));

// Rodapé
export const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: `${theme.palette.background.header}60`,
  gap: theme.spacing(1),
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
  '&:disabled': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%) !important`,
    color: `${theme.palette.text.disabled} !important`,
  },
}));
