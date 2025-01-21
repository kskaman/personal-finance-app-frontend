import { Stack } from "@mui/material";
import { Link } from "react-router";

import logoIcon from "../assets/images/logo-large.svg";

const Navbar = () => {
  return (
    <Stack
      direction="column"
      sx={{
        backgroundColor: "#201f24",
        color: "white",
        padding: 2,
        alignItems: "center",
      }}
    >
      <div id="logo" style={{ marginBottom: "1rem" }}>
        <img src={logoIcon} alt="Logo" />
      </div>
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
  );
};

export default Navbar;
