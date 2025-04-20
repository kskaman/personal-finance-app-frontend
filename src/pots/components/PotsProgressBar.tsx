import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { formatNumber } from "../../utils/utilityFunctions";

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
  const theme = useTheme();
  const fraction = (value / target) * 100;

  const currencySymbol = useContext(SettingsContext).selectedCurrency;
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
          {value < 0
            ? `-${currencySymbol}${formatNumber(Math.abs(value))}`
            : `${currencySymbol}${formatNumber(value)}`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={fraction >= 100 ? 100 : fraction}
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
          Target of {`${currencySymbol}${formatNumber(target)}`}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PotsProgressBar;
