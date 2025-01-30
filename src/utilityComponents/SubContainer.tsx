import { ReactNode } from "react";
import theme from "../theme/theme";
import { Stack } from "@mui/material";

interface SubContainerProps {
  children: ReactNode;
  padding?: object;
  gap: string;
}

const SubContainer = ({
  children,
  padding = { xs: "24px 20px", sm: "32px" },
  gap,
}: SubContainerProps) => {
  return (
    <Stack
      direction="column"
      bgcolor={theme.palette.primary.contrastText}
      borderRadius="12px"
      gap={gap}
      sx={{
        padding,
      }}
    >
      {children}
    </Stack>
  );
};

export default SubContainer;
