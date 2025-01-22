import { Stack } from "@mui/material";

import theme from "../theme/theme";

import logoIcon from "../assets/images/logo-large.svg";
import overviewIcon from "../assets/images/icon-nav-overview.svg";
import transactionsIcon from "../assets/images/icon-nav-transactions.svg";
import budgetsIcon from "../assets/images/icon-nav-budgets.svg";
import potsIcon from "../assets/images/icon-nav-pots.svg";
import billsIcon from "../assets/images/icon-nav-recurring-bills.svg";
import minimizeIcon from "../assets/images/icon-minimize-menu.svg";
import NavItem from "../utilityComponents/NavItem";
import MinimizeButton from "../utilityComponents/MinimizeButton";

const Navbar = () => {
  return (
    <Stack
      direction="column"
      spacing={3} // spacing of 3 = 3 * 8px
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",

        width: "300px",
        borderRadius: "0 16px 16px 0",
        paddingBottom: "24px",
      }}
    >
      <div id="logo" style={{ padding: "40px 32px" }}>
        <img src={logoIcon} alt="Logo" />
      </div>

      <Stack sx={{ width: "100%", height: "calc(100vh - 174px)" }}>
        <NavItem to="/" icon={overviewIcon} text="Overview" />
        <NavItem
          to="/transactions"
          icon={transactionsIcon}
          text="Transactions"
        />
        <NavItem to="/budgets" icon={budgetsIcon} text="Budgets" />
        <NavItem to="/pots" icon={potsIcon} text="Pots" />
        <NavItem to="/bills" icon={billsIcon} text="Recurring Bills" />
      </Stack>

      <MinimizeButton icon={minimizeIcon} />
    </Stack>
  );
};

export default Navbar;
