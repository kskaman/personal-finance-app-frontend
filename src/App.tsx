import { useContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useMediaQuery, Box, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import OverViewPage from "./pages/OverViewPage";
import BillsPage from "./pages/BillsPage";
import BudgetsPage from "./pages/BudgetsPage";
import PotsPage from "./pages/PotsPage";
import TransactionsPage from "./pages/TransactionsPage";
import TabNavBar from "./components/TabNavBar";
import theme from "./theme/theme";
import SettingsPage from "./pages/SettingsPage";
import { SettingsContext } from "./context/SettingsContext";

const App = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTabletOrMobile = useMediaQuery("(max-width:900px)");

  const { selectedFont } = useContext(SettingsContext);

  // Create a dynamic theme using the selected font, renamed to settingsTheme
  const settingsTheme = useMemo(() => {
    const fontFamily =
      selectedFont === "public-sans"
        ? "public-sans"
        : selectedFont === "noto-serif"
        ? "noto-serif"
        : "source-code";

    return createTheme({
      ...theme,
      typography: {
        ...theme.typography,
        fontFamily,
      },
    });
  }, [selectedFont]);

  return (
    <ThemeProvider theme={settingsTheme}>
      <CssBaseline />
      <Router>
        <Stack
          bgcolor={settingsTheme.palette.background.default}
          direction={isTabletOrMobile ? "column" : "row"}
          sx={{ height: "100%", width: "100%" }}
        >
          {!isTabletOrMobile && <Navbar />}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<OverViewPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/pots" element={<PotsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Box>
          {isTabletOrMobile && <TabNavBar isMobile={isMobile} />}
        </Stack>
      </Router>
    </ThemeProvider>
  );
};

export default App;
