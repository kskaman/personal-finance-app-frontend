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
        Icon={OverViewIcon}
        text="Overview"
        isMobile={isMobile}
      />
      <TabNavItem
        to="/transactions"
        Icon={TransactionsIcon}
        text="Transactions"
        isMobile={isMobile}
      />
      <TabNavItem
        to="/budgets"
        Icon={BudgetsIcon}
        text="Budgets"
        isMobile={isMobile}
      />
      <TabNavItem to="/pots" Icon={PotsIcon} text="Pots" isMobile={isMobile} />
      <TabNavItem
        to="/bills"
        Icon={BillsIcon}
        text="Recurring Bills"
        isMobile={isMobile}
      />
    </Stack>
  );
};

export default TabNavBar;
