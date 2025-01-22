import { Stack } from "@mui/material";
import { Link } from "react-router";

import logoIcon from "../assets/images/logo-large.svg";
import theme from "../theme/theme";

const Navbar = () => {
  return (
    <Stack
      direction="column"
      spacing={3} // spacing of 3 = 3 * 8px
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div id="logo" style={{ marginBottom: "1rem" }}>
        <img src={logoIcon} alt="Logo" />
      </div>
      <Stack>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", margin: "8px 0" }}
        >
          Overview
        </Link>
        <Link
          to="/transactions"
          style={{ color: "white", textDecoration: "none", margin: "8px 0" }}
        >
          Transactions
        </Link>
        <Link
          to="/budgets"
          style={{ color: "white", textDecoration: "none", margin: "8px 0" }}
        >
          Budgets
        </Link>
        <Link
          to="/pots"
          style={{ color: "white", textDecoration: "none", margin: "8px 0" }}
        >
          Pots
        </Link>
        <Link
          to="/bills"
          style={{ color: "white", textDecoration: "none", margin: "8px 0" }}
        >
          Recurring Bills
        </Link>
      </Stack>
      <div>Minimize</div>
    </Stack>
  );
};

export default Navbar;
