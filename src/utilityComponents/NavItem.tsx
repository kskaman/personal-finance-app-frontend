import { Typography, Box, Stack } from "@mui/material";

import theme from "../theme/theme";
import { Link } from "react-router";

interface NavItemProps {
  icon: string;
  text: string;
  to: string;
}

const NavItem = ({ to, icon, text }: NavItemProps) => {
  return (
    <Stack
      component={Link}
      to={to}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        width: "276px",
        height: "56px",
        padding: "16px 32px",
        color: theme.palette.background.paper,
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <Box
        component="img"
        src={icon}
        alt={`${text} icon`}
        sx={{ width: "24px", height: "24px" }}
      />
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

export default NavItem;
