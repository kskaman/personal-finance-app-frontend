import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar/Navbar";
import TabNavBar from "../navbar/TabNavBar";
import { Outlet } from "react-router";

const MainLayout = () => {
  const isMobile = useMediaQuery("(max-width:520px)");
  const isTabletOrMobile = useMediaQuery("(max-width:900px)");
  const theme = useTheme();

  return (
    <Stack
      bgcolor={theme.palette.background.default}
      direction={isTabletOrMobile ? "column" : "row"}
      sx={{ height: "100%", width: "100%", overflowY: "auto" }}
    >
      {!isTabletOrMobile && <Navbar />}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </Box>
      {isTabletOrMobile && <TabNavBar isMobile={isMobile} />}
    </Stack>
  );
};

export default MainLayout;
