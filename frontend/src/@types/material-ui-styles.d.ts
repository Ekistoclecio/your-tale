// types/material-ui-styles.d.ts

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    header: string;
    card: string;
    input: string;
  }

  interface Palette {
    background: TypeBackground;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
  interface Theme {
    shape: {
      borderRadius: number;
      borderRadiusSmall: number;
      borderRadiusMedium: number;
      borderRadiusLarge: number;
      borderRadiusXLarge: number;
      borderRadiusFull: string;
    };
    shadowsCustom: {
      sm: (color: string) => string;
      md: (color: string) => string;
      lg: (color: string) => string;
      xl: (color: string) => string;
      glow: (color: string) => string;
      inset: (color: string) => string;
    };
  }

  interface ThemeOptions {
    spacing: (factor: number) => string;
    shape: {
      borderRadius: number;
      borderRadiusSmall: number;
      borderRadiusMedium: number;
      borderRadiusLarge: number;
      borderRadiusXLarge: number;
      borderRadiusFull: string;
    };
    shadowsCustom: {
      sm: (color: string) => string;
      md: (color: string) => string;
      lg: (color: string) => string;
      xl: (color: string) => string;
      glow: (color: string) => string;
      inset: (color: string) => string;
    };
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold: number;
  }

  interface TypographyVariants {
    fontWeightSemiBold: number;
  }
}
