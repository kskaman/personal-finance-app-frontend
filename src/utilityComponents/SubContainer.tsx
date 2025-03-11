import { ReactNode } from "react";
import theme from "../theme/theme";
import { Stack } from "@mui/material";

interface SubContainerProps {
  children: ReactNode;
  padding?: object;
  gap?: string;
  height?: string;
  width?: string;
  flex?: number;
  bgColor?: string;
  direction?: "row" | "column";
}

const SubContainer = ({
  children,
  padding = { xs: "24px 20px", sm: "32px" },
  gap = "20px",
  flex,
  bgColor,
  height,
  width,
  direction = "column",
}: SubContainerProps) => {
  return (
    <Stack
      direction={direction}
      flex={flex}
      height={height || "auto"}
      width={width || "auto"}
      bgcolor={bgColor || theme.palette.primary.contrastText}
      borderRadius="12px"
      gap={gap}
      sx={{
        padding,
        overFlowY: "auto",
      }}
    >
      {children}
    </Stack>
  );
};

export default SubContainer;
