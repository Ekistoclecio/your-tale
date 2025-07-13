import { palette } from './palette';

const baseBackground = palette.background?.default || '#1D1A2F'; // Azul noturno

export const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    scrollBehavior: 'smooth',
  },
  html: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    height: '100vh',
    width: '100vw',
    backgroundColor: baseBackground,
    backgroundAttachment: 'fixed',
    fontSize: '10px',
  },
  body: {
    height: '100%',
    width: '100%',
  },
  '#root': {
    height: '100%',
    width: '100%',
  },
  input: {
    '&[type=number]': {
      MozAppearance: 'textfield',
      '&::-webkit-outer-spin-button': {
        margin: 0,
        WebkitAppearance: 'none',
      },
      '&::-webkit-inner-spin-button': {
        margin: 0,
        WebkitAppearance: 'none',
      },
    },
  },
  img: {
    display: 'block',
    maxWidth: '100%',
  },
  ul: {
    margin: 0,
    padding: 0,
  },
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: `${palette.primary?.main}CC`,
    borderRadius: '8px',
    border: '2px solid transparent',
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: palette.primary?.dark,
  },
  '::-webkit-scrollbar-corner': {
    background: 'transparent',
  },
} as const;
