import { TypographyVariantsOptions } from '@mui/material';

export const typography: TypographyVariantsOptions = {
  fontFamily: 'var(--font-cinzel)', // base para texto geral
  htmlFontSize: 10,

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,

  // Títulos principais (hero, seções narrativas)
  h1: {
    fontSize: '4.8rem',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '0.02em',
    fontFamily: 'var(--font-pirata-one)',
  },
  h2: {
    fontSize: '4.0rem',
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '0.015em',
    fontFamily: 'var(--font-pirata-one)',
  },
  h3: {
    fontSize: '3.2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '0.01em',
    fontFamily: 'var(--font-pirata-one)',
  },
  h4: {
    fontSize: '2.4rem',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '0.005em',
    fontFamily: 'var(--font-pirata-one)',
  },
  h5: {
    fontSize: '2.0rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.005em',
    fontFamily: 'var(--font-cinzel)',
  },
  h6: {
    fontSize: '1.8rem',
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: '0.005em',
    fontFamily: 'var(--font-cinzel)',
  },

  subtitle1: {
    fontSize: '1.6rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.005em',
  },

  subtitle2: {
    fontSize: '1.4rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.005em',
  },

  body1: {
    fontSize: '1.6rem',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.003em',
  },
  body2: {
    fontSize: '1.4rem',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.003em',
  },

  button: {
    fontSize: '1.4rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-cinzel)',
  },

  caption: {
    fontSize: '1.2rem',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '0.005em',
  },
};
