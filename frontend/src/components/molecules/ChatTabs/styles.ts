import { styled } from '@mui/material/styles';
import { Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';

export const ChatTabsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0, // Importante para o flex funcionar corretamente
});

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 40,
  backgroundColor: `${theme.palette.background.header}60`,
  borderRadius: `${theme.shape.borderRadiusSmall}px ${theme.shape.borderRadiusSmall}px 0 0`,
  '& .MuiTabs-flexContainer': {
    height: 40,
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main,
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  minWidth: 100,
  padding: theme.spacing(0.5, 2),
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  '&.Mui-selected': {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: `${theme.palette.action.hover}10`,
  },
  '& .MuiTab-iconWrapper': {
    marginBottom: 0,
    marginRight: theme.spacing(0.5),
  },
}));

export const TabPanel = styled(motion.div)({
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  minHeight: 0, // Importante para o flex funcionar corretamente
});
