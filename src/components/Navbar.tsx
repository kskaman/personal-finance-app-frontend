import { useState } from "react";
import { Stack } from "@mui/material";

import theme from "../theme/theme";

import logoIcon from "../assets/images/logo-large.svg";
import miniLogoIcon from "../assets/images/logo-small.svg";

import OverViewIcon from "../Icons/OverViewIcon";
import TransactionsIcon from "../Icons/TransactionsIcon";
import BudgetsIcon from "../Icons/BudgetsIcon";
import PotsIcon from "../Icons/PotsIcon";
import BillsIcon from "../Icons/BillsIcon";

import NavItem from "../utilityComponents/NavItem";
import MinimizeButton from "../utilityComponents/MinimizeButton";

const Navbar = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const handleToggleMinimize = () => {
    setIsMinimized((prev: boolean) => !prev);
  };

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

        width: isMinimized ? "88px" : "300px",
        borderRadius: "0 16px 16px 0",
        paddingBottom: "24px",
      }}
    >
      <div id="logo" style={{ padding: "40px 32px" }}>
        {isMinimized ? (
          <img src={miniLogoIcon} alt="Logo" />
        ) : (
          <img src={logoIcon} alt="Logo" />
        )}
      </div>

      <Stack sx={{ width: "100%", height: "calc(100vh - 174px)" }}>
        <NavItem
          to="/"
          icon={OverViewIcon}
          text="Overview"
          isMinimized={isMinimized}
        />
        <NavItem
          to="/transactions"
          icon={TransactionsIcon}
          text="Transactions"
          isMinimized={isMinimized}
        />
        <NavItem
          to="/budgets"
          icon={BudgetsIcon}
          text="Budgets"
          isMinimized={isMinimized}
        />
        <NavItem
          to="/pots"
          icon={PotsIcon}
          text="Pots"
          isMinimized={isMinimized}
        />
        <NavItem
          to="/bills"
          icon={BillsIcon}
          text="Recurring Bills"
          isMinimized={isMinimized}
        />
      </Stack>

      <MinimizeButton
        isMinimized={isMinimized}
        onClick={handleToggleMinimize}
      />
    </Stack>
  );
};

export default Navbar;
