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
}
