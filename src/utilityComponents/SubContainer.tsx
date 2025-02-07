import { ReactNode } from "react";
import theme from "../theme/theme";
import { Stack } from "@mui/material";

interface SubContainerProps {
  children: ReactNode;
  padding?: object;
  gap?: string;
  height?: string;
  flex?: number;
  bgColor?: string;
}

const SubContainer = ({
  children,
  padding = { xs: "24px 20px", sm: "32px" },
  gap = "20px",
  flex,
  bgColor,
  height,
}: SubContainerProps) => {
  return (
    <Stack
      direction="column"
      flex={flex}
      height={height || "auto"}
      bgcolor={bgColor || theme.palette.primary.contrastText}
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
