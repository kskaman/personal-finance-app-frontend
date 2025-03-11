// TabNavItem.tsx (unchanged from your snippet, except we confirm it’s imported in TabNavBar)
import { Typography, Box, Stack, useTheme } from "@mui/material";
import { NavLink } from "react-router";

interface TabNavItemProps {
  Icon: React.FC<{ color: string }>;
  text: string;
  to: string;
  isMobile: boolean;
}

const TabNavItem = ({ to, Icon, text, isMobile }: TabNavItemProps) => {
  const theme = useTheme();
  return (
    <Stack
      component={NavLink}
      to={to}
      direction="column"
      alignItems="center"
      spacing={0}
      sx={{
        width: isMobile ? "68.6px" : "108px",
        height: isMobile ? "44px" : "66px",
        padding: isMobile ? "9px 0 15px 0" : "7px 0 13px 0",
        color: theme.palette.background.paper,
        cursor: "pointer",
        textDecoration: "none",
        ":hover": {
          color: theme.palette.secondary.contrastText,
        },
        "&.active": {
          backgroundColor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.main,
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
          borderBottom: `5px solid ${theme.palette.secondary.main}`,
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
          justifyContent: "center",
          alignItems: "center",
          width: "24px",
          height: "24px",
        }}
      >
        <Icon color="inherit" />
      </Box>
      {!isMobile && (
        <Typography
          noWrap
          sx={{
            height: "18px",
            padding: "3px 0 3px 0",
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
      )}
    </Stack>
  );
};

export default TabNavItem;
