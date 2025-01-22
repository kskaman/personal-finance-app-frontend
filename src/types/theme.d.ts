import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    others?: {
      [key: string]: string;
    };
  }
    
  interface PaletteOptions {
    others?: {
      [key: string]: string;
    };
  }
}
