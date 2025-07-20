import { Palette } from '@mui/material';

export const palette: Partial<Palette> = {
  primary: {
    main: '#38243D',
    light: '#5C3C5F',
    dark: '#241528',
    contrastText: '#F8F4EF',
  },
  secondary: {
    main: '#E6A74A',
    light: '#FFD88C',
    dark: '#A96F1D',
    contrastText: '#1A1A1A',
  },
  info: {
    main: '#2C6FB3',
    light: '#5C9BE0',
    dark: '#1D4D82',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D63C3C',
    light: '#E57373',
    dark: '#8E2C3B',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#E6B200',
    light: '#FFE082',
    dark: '#9F7C00',
    contrastText: '#000000',
  },
  success: {
    main: '#4C9F70',
    light: '#81C784',
    dark: '#2E7D32',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#F8F4EF',
    secondary: '#D1C6BE',
    disabled: '#AFA3A3',
  },
  action: {
    active: '#E6A74A',
    hover: '#FFD88C',
    hoverOpacity: 0.08,
    selected: '#38243D',
    selectedOpacity: 0.16,
    disabled: '#AFA3A3',
    disabledBackground: '#241528',
    disabledOpacity: 0.38,
    focus: '#38243D',
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  background: {
    default: '#1A141F',
    input: '#29232E',
    paper: '#F8F4EF',
    header: '#38243D',
    card: '#7A5E84',
  },
};
