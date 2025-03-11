import { useContext, useState } from "react";
import { Stack, useTheme } from "@mui/material";

import logoIcon from "../assets/images/logo-large.svg";
import miniLogoIcon from "../assets/images/logo-small.svg";

import OverViewIcon from "../Icons/OverViewIcon";
import TransactionsIcon from "../Icons/TransactionsIcon";
import BudgetsIcon from "../Icons/BudgetsIcon";
import PotsIcon from "../Icons/PotsIcon";
import BillsIcon from "../Icons/BillsIcon";

import NavItem from "../utilityComponents/NavItem";
import MinimizeButton from "../utilityComponents/MinimizeButton";
import SettingsIcon from "../Icons/SettingsIcon";
import { SettingsContext } from "../context/SettingsContext";

const Navbar = () => {
  const theme = useTheme();

  const { displayedModules } = useContext(SettingsContext);
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
          Icon={OverViewIcon}
          text="Overview"
          isMinimized={isMinimized}
        />
        <NavItem
          to="/transactions"
          Icon={TransactionsIcon}
          text="Transactions"
          isMinimized={isMinimized}
        />
        {displayedModules.budgets.using && (
          <NavItem
            to="/budgets"
            Icon={BudgetsIcon}
            text="Budgets"
            isMinimized={isMinimized}
          />
        )}
        {displayedModules.pots.using && (
          <NavItem
            to="/pots"
            Icon={PotsIcon}
            text="Pots"
            isMinimized={isMinimized}
          />
        )}
        {displayedModules.recurringBills.using && (
          <NavItem
            to="/bills"
            Icon={BillsIcon}
            text="Recurring Bills"
            isMinimized={isMinimized}
          />
        )}
      </Stack>

      <NavItem
        to="/settings"
        Icon={SettingsIcon}
        text="Settings"
        isMinimized={isMinimized}
      />
      <MinimizeButton
        isMinimized={isMinimized}
        onClick={handleToggleMinimize}
      />
    </Stack>
  );
};

export default Navbar;
