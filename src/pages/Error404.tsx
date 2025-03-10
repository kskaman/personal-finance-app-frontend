import { Box, Typography } from "@mui/material";
import theme from "../theme/theme";

const Error404 = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.primary.contrastText,
        padding: "16px",
      }}
    >
      <Typography variant="h3" color={theme.palette.primary.main}>
        404 - Page Not Found
      </Typography>
    </Box>
  );
};

export default Error404;
