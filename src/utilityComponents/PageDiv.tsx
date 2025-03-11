import { Box } from "@mui/material";
import { ReactNode } from "react";

const PageDiv = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      minHeight="100%"
      width="100%"
      sx={{
        px: { xs: 2, sm: 5 },
        py: 4,
        overflowY: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default PageDiv;
