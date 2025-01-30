import { Box } from "@mui/material";
import theme from "../theme/theme";
import { ReactNode } from "react";

const PageDiv = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      bgcolor={theme.palette.background.default}
      minHeight="100%"
      width="100%"
      sx={{
        px: { xs: 2, sm: 5 },
        py: 4,
      }}
    >
      {children}
    </Box>
  );
};

export default PageDiv;
