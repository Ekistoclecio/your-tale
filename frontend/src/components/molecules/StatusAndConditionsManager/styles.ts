import { styled } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';

export const StatusChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: `${theme.palette.warning.main}20`,
  color: theme.palette.warning.main,
  border: `1px solid ${theme.palette.warning.main}60`,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.warning.main,
    '&:hover': {
      color: theme.palette.warning.dark,
    },
  },
}));

export const AddConditionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

export const CommonConditionsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
