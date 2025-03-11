import { Typography, Box, Stack, useTheme } from "@mui/material";
import { NavLink } from "react-router";

interface NavItemProps {
  Icon: React.FC<{ color: string }>;
  text: string;
  to: string;
  isMinimized: boolean;
}

const NavItem = ({ to, Icon, text, isMinimized }: NavItemProps) => {
  const theme = useTheme();
  return (
    <Stack
      component={NavLink}
      to={to}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        width: isMinimized ? "80px" : "276px",
        height: "56px",
        padding: "16px 32px",
        color: theme.palette.background.paper,
        cursor: "pointer",
        textDecoration: "none",
        ":hover": {
          color: theme.palette.secondary.contrastText,
        },
        // this should be at end else hover properties show up
        "&.active": {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          borderLeft: `5px solid ${theme.palette.secondary.main}`,
          ".iconClass": {
            color: theme.palette.secondary.main,
          },
        },
      }}
    >
      <Box
        className="iconClass"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
        }}
      >
        <Icon color="inherit" />
      </Box>
      {!isMinimized && (
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          {text}
        </Typography>
      )}
    </Stack>
  );
};

export default NavItem;
