import { Routes, Route } from "react-router";

import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";

import Navbar from "./components/Navbar";
import OverViewPage from "./pages/OverViewPage";
import BillsPage from "./pages/BillsPage";
import BudgetsPage from "./pages/BudgetsPage";
import PotsPage from "./pages/PotsPage";
import TransactionsPage from "./pages/TransactionsPage";
import TabNavBar from "./components/TabNavBar";

import { useContext } from "react";
import { SettingsContext } from "./context/SettingsContext";
import SettingsPage from "./pages/SettingsPage";

const MainApp = () => {
  const isMobile = useMediaQuery("(max-width:520px)");

  const isTabletOrMobile = useMediaQuery("(max-width:900px)");

  const { displayedModules } = useContext(SettingsContext);

  const theme = useTheme();

  return (
    <>
      {/**
      If large screen => row layout with side navbar
      If tablet/mobile => column layout with tab navbar
    **/}

      <Stack
        bgcolor={theme.palette.background.default}
        direction={isTabletOrMobile ? "column" : "row"}
        sx={{ height: "100%", width: "100%", overflowY: "auto" }}
      >
        {!isTabletOrMobile && <Navbar />}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<OverViewPage />} />
            {/* We will remove Error404 when backend is complete.
              Sending an error 404 so that browser automatically handles it will
              be done in backend */}
            {/* Only allow access to BudgetsPage if budgets module is enabled */}
            {displayedModules.budgets.using && (
              <Route path="/budgets" element={<BudgetsPage />} />
            )}
            {/* Only allow access to PotsPage if pots module is enabled */}
            {displayedModules.pots.using && (
              <Route path="/pots" element={<PotsPage />} />
            )}
            {/* Only allow access to BillsPage if recurringBills module is enabled */}
            {displayedModules.recurringBills.using && (
              <Route path="/bills" element={<BillsPage />} />
            )}
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
        {isTabletOrMobile && <TabNavBar isMobile={isMobile} />}
      </Stack>
    </>
  );
};

export default MainApp;
