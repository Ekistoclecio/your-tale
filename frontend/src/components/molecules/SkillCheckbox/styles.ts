import { Box, FormControlLabel, Typography, styled } from '@mui/material';

export const SkillContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  paddingRight: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.input,
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  flex: 1,
  margin: 0,
}));

export const LabelWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));

export const SkillName = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const AttributeName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ModifierValue = styled(Typography)(() => ({
  fontWeight: 700,
  textAlign: 'right',
}));
