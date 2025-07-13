import { Palette } from '@mui/material';

export const palette: Partial<Palette> = {
  primary: {
    main: '#38243D', // Roxo amadeirado escuro
    light: '#5C3C5F', // Roxo suave
    dark: '#241528', // Roxo profundo quase preto
    contrastText: '#F8F4EF', // Creme claro
  },
  secondary: {
    main: '#E6A74A', // Dourado quente
    light: '#FFD88C', // Dourado claro
    dark: '#A96F1D', // Bronze escuro
    contrastText: '#1A1A1A',
  },
  info: {
    main: '#2C6FB3', // Azul médio místico
    light: '#5C9BE0', // Azul claro
    dark: '#1D4D82', // Azul escuro
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D63C3C',
    light: '#E57373',
    dark: '#8E2C3B',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#E6B200', // Amarelo queimado
    light: '#FFE082',
    dark: '#9F7C00',
    contrastText: '#000000',
  },
  success: {
    main: '#4C9F70', // Verde seco
    light: '#81C784',
    dark: '#2E7D32',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#F8F4EF', // Texto claro sobre fundo escuro
    secondary: '#D1C6BE', // Bege acinzentado
    disabled: '#AFA3A3', // Cinza rosado
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
    default: '#1A141F', // Roxo escuro profundo
    input: '#29232E', // Roxo escuro levemente iluminado
    paper: '#F8F4EF', // Creme claro
    header: '#38243D', // Roxo escuro
    card: '#7A5E84', // Roxo intermediário
  },
};
