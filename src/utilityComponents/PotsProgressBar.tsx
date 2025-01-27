import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import theme from "../theme/theme";
import { formatNumber } from "../utils/utilityFunctions";

interface PotsProgressBarProps {
  value: number;
  target: number;
  color: string;
  bgColor: string;
}

const PotsProgressBar = ({
  value,
  target,
  color,
  bgColor,
}: PotsProgressBarProps) => {
  const fraction = (value / target) * 100;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          height: "38px",
        }}
      >
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Total Saved
        </Typography>
        <Typography fontSize="32px" color={theme.palette.primary.main}>
          ${formatNumber(value)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={fraction}
        sx={{
          height: "8px",
          borderRadius: "4px",
          backgroundColor: bgColor,
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: "4px",
          },
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "18px" }}
      >
        <Typography fontSize="12px" color={theme.palette.primary.light}>
          {fraction.toFixed(2)} %
        </Typography>
        <Typography fontSize="12px" color={theme.palette.primary.light}>
          Target of ${formatNumber(target)}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PotsProgressBar;
