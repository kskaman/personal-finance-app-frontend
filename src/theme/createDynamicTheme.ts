import { createTheme } from "@mui/material/styles";
import palette from "./palette";

export function createDynamicTheme(selectedFont: string) {
  return createTheme({
    palette,
    typography: {
      fontFamily: selectedFont,
    },
    components: {
      MuiRadio: {
        defaultProps: {
          disableRipple: true,
          disableFocusRipple: true,
          disableTouchRipple: true,
        },
      },
    },
  });
}