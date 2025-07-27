import { styled, alpha } from '@mui/material/styles';
import { Box, TextField, IconButton, Card, List, ListItem } from '@mui/material';

// Container geral do chat
export const ChatContainer = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: `${theme.palette.background.card}20`,
  border: `1px solid ${theme.palette.secondary.main}40`,
  borderRadius: theme.shape.borderRadiusMedium,
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  padding: 0,
}));

// Área de mensagens
export const MessagesArea = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  overflowY: 'auto',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: theme.spacing(0.5),
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: `${theme.palette.background.input}50`,
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.secondary.main,
    borderRadius: 3,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
}));

// Input da mensagem
export const MessageInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.secondary.main}30`,
  backgroundColor: `${theme.palette.background.header}50`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    backgroundColor: `${theme.palette.background.input}80`,
    borderRadius: theme.shape.borderRadiusMedium,
    '& fieldset': {
      borderColor: `${theme.palette.secondary.main}40`,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.secondary.main}20`,
  border: `1px solid ${theme.palette.secondary.main}60`,
  color: theme.palette.secondary.main,
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: `${theme.palette.secondary.main}30`,
    borderColor: theme.palette.secondary.main,
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    borderColor: theme.palette.divider,
    color: theme.palette.action.disabled,
  },
  transition: 'all 0.2s ease-in-out',
}));

// Estado vazio
export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: theme.spacing(2),
}));

// Seção de anotações
export const NotesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const NotesList = styled(List)({
  flex: 1,
  overflow: 'auto',
  padding: 0,
});

export const NoteItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[800], 0.4),
  border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
  borderRadius: theme.shape.borderRadiusSmall,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.3)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[700], 0.5),
    borderColor: alpha(theme.palette.grey[400], 0.5),
    boxShadow: `0 4px 10px ${alpha(theme.palette.common.black, 0.5)}`,
  },
}));

export const AddNoteForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: `${theme.palette.background.header}40`,
  borderTop: `1px solid ${theme.palette.secondary.main}30`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
