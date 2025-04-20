import { Navigate, Route, Routes } from "react-router";
import MainLayout from "./MainLayout";
import OverViewPage from "../overview/OverViewPage";
import BillsPage from "../recurringBills/BillsPage";
import BudgetsPage from "../budgets/BudgetsPage";
import PotsPage from "../pots/PotsPage";
import TransactionsPage from "../transactions/TransactionsPage";
import SettingsPage from "../settings/SettingsPage";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

const MainRoutes = () => {
  const { displayedModules } = useContext(SettingsContext);

  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<OverViewPage />} />
        {/* Only allow access to BudgetsPage if the module is enabled */}
        {displayedModules.budgets.using && (
          <Route path="budgets" element={<BudgetsPage />} />
        )}
        {/* Only allow access to PotsPage if the module is enabled */}
        {displayedModules.pots.using && (
          <Route path="pots" element={<PotsPage />} />
        )}
        {/* Only allow access to BillsPage if the module is enabled */}
        {displayedModules.recurringBills.using && (
          <Route path="bills" element={<BillsPage />} />
        )}
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
