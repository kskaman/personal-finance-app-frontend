import { BrowserRouter as Router, Routes, Route } from "react-router";

import { Stack } from "@mui/material";

import Navbar from "./components/Navbar";
import OverViewPage from "./pages/OverViewPage";
import BillsPage from "./pages/BillsPage";
import BudgetsPage from "./pages/BudgetsPage";
import PotsPage from "./pages/PotsPage";
import TransactionsPage from "./pages/TransactionsPage";

const App = () => {
  return (
    <Stack direction="row">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<OverViewPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/pots" element={<PotsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default App;
