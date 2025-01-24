import { Stack } from "@mui/material";

import theme from "../theme/theme";

import TabNavItem from "../utilityComponents/TabNavItem";
import OverViewIcon from "../Icons/OverViewIcon";
import TransactionsIcon from "../Icons/TransactionsIcon";
import BudgetsIcon from "../Icons/BudgetsIcon";
import PotsIcon from "../Icons/PotsIcon";
import BillsIcon from "../Icons/BillsIcon";

interface TabNavBarProps {
  isMobile: boolean;
}

const TabNavBar = ({ isMobile }: TabNavBarProps) => {
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-evenly"
      height={isMobile ? "52px" : "74px"}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <TabNavItem
        to="/"
        icon={OverViewIcon}
        text="Overview"
        isMobile={isMobile}
      />
      <TabNavItem
        to="/transactions"
        icon={TransactionsIcon}
        text="Transactions"
        isMobile={isMobile}
      />
      <TabNavItem
        to="/budgets"
        icon={BudgetsIcon}
        text="Budgets"
        isMobile={isMobile}
      />
      <TabNavItem to="/pots" icon={PotsIcon} text="Pots" isMobile={isMobile} />
      <TabNavItem
        to="/bills"
        icon={BillsIcon}
        text="Recurring Bills"
        isMobile={isMobile}
      />
    </Stack>
  );
};

export default TabNavBar;
