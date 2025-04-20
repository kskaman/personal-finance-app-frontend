import { Stack, useTheme } from "@mui/material";
import TabNavItem from "./TabNavItem";
import OverViewIcon from "../Icons/OverViewIcon";
import TransactionsIcon from "../Icons/TransactionsIcon";
import BudgetsIcon from "../Icons/BudgetsIcon";
import PotsIcon from "../Icons/PotsIcon";
import BillsIcon from "../Icons/BillsIcon";
import SettingsIcon from "../Icons/SettingsIcon";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

interface TabNavBarProps {
  isMobile: boolean;
}

const TabNavBar = ({ isMobile }: TabNavBarProps) => {
  const theme = useTheme();

  const { displayedModules } = useContext(SettingsContext);
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-between"
      height={isMobile ? "52px" : "74px"}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        px: "4px",
      }}
    >
      <TabNavItem
        to="/app/overview"
        Icon={OverViewIcon}
        text="Overview"
        isMobile={isMobile}
      />
      <TabNavItem
        to="/app/transactions"
        Icon={TransactionsIcon}
        text="Transactions"
        isMobile={isMobile}
      />
      {displayedModules.budgets.using && (
        <TabNavItem
          to="/app/budgets"
          Icon={BudgetsIcon}
          text="Budgets"
          isMobile={isMobile}
        />
      )}

      {displayedModules.pots.using && (
        <TabNavItem
          to="/app/pots"
          Icon={PotsIcon}
          text="Pots"
          isMobile={isMobile}
        />
      )}

      {displayedModules.recurringBills.using && (
        <TabNavItem
          to="/app/bills"
          Icon={BillsIcon}
          text="Recurring Bills"
          isMobile={isMobile}
        />
      )}

      <TabNavItem
        to="/app/settings"
        Icon={SettingsIcon}
        text="Settings"
        isMobile={isMobile}
      />
    </Stack>
  );
};

export default TabNavBar;
