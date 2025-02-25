import { createTheme } from "@mui/material";
import palette from "./palette";

const theme = createTheme({
  palette: palette,
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

export default theme;
