import { ReactNode, useContext, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { SettingsContext } from "./SettingsContext";
import { createDynamicTheme } from "../theme/createDynamicTheme";

export const ThemeManager = ({ children }: { children: ReactNode }) => {
  const { selectedFont } = useContext(SettingsContext);

  // useMemo to avoid recreating the theme on every render
  const theme = useMemo(() => createDynamicTheme(selectedFont), [selectedFont]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
