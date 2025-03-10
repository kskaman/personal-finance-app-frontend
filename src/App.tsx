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
import Error404 from "./pages/Error404";

const App = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTabletOrMobile = useMediaQuery("(max-width:900px)");

  const { selectedFont, displayedModules } = useContext(SettingsContext);

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
              {/* We will remove Error404 when backend is complete.
              Sending an error 404 so that browser automatically handles it will
              be done in backend */}
              {/* Only allow access to BudgetsPage if budgets module is enabled */}
              {displayedModules.budgets.using ? (
                <Route path="/budgets" element={<BudgetsPage />} />
              ) : (
                <Route path="/budgets" element={<Error404 />} />
              )}
              {/* Only allow access to PotsPage if pots module is enabled */}
              {displayedModules.pots.using ? (
                <Route path="/pots" element={<PotsPage />} />
              ) : (
                <Route path="/pots" element={<Error404 />} />
              )}
              {/* Only allow access to BillsPage if recurringBills module is enabled */}
              {displayedModules.recurringBills.using ? (
                <Route path="/bills" element={<BillsPage />} />
              ) : (
                <Route path="/bills" element={<Error404 />} />
              )}
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
