import { BrowserRouter as Router, Routes, Route } from "react-router";

import { Box, Stack, useMediaQuery } from "@mui/material";

import Navbar from "./components/Navbar";
import OverViewPage from "./pages/OverViewPage";
import BillsPage from "./pages/BillsPage";
import BudgetsPage from "./pages/BudgetsPage";
import PotsPage from "./pages/PotsPage";
import TransactionsPage from "./pages/TransactionsPage";
import TabNavBar from "./components/TabNavBar";

const App = () => {
  const isMobile = useMediaQuery("(max-width:520px)");

  const isTabletOrMobile = useMediaQuery("(max-width:768px)");

  return (
    <Router>
      {/** 
      If large screen => row layout with side navbar
      If tablet/mobile => column layout with tab navbar 
    **/}

      {isTabletOrMobile ? (
        <Stack direction="column" sx={{ height: "100vh", width: "100vw" }}>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<OverViewPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/pots" element={<PotsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </Box>
          <TabNavBar isMobile={isMobile} />
        </Stack>
      ) : (
        <Stack direction="row" sx={{ height: "100vh", width: "100vw" }}>
          <Navbar />
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<OverViewPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/pots" element={<PotsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </Box>
        </Stack>
      )}
    </Router>
  );
};

export default App;
