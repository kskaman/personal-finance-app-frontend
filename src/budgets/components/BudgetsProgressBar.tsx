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

interface BudgetsProgressBarProps {
  value: number;
  total: number;
  color: string;
  bgColor: string;
}

const BudgetsProgressBar = ({
  value,
  total,
  color,
  bgColor,
}: BudgetsProgressBarProps) => {
  const theme = useTheme();

  const isOverBudget = value > total;
  const fraction = isOverBudget
    ? ((value - total) / value) * 100
    : (value / total) * 100;
  const remaining = Math.abs(total - value);

  const currencySymbol = useContext(SettingsContext).selectedCurrency;
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          height: "21px",
        }}
      >
        <Typography fontSize="14px" color={theme.palette.primary.light}>
          Maximum of {`${currencySymbol}${formatNumber(total)}`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={isOverBudget ? 100 : fraction}
        sx={{
          height: "32px",
          borderRadius: "4px",
          backgroundColor: bgColor,
          "& .MuiLinearProgress-bar": {
            backgroundColor: isOverBudget
              ? theme.palette.secondary.dark
              : color,
            borderRadius: "4px",
          },
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "43px" }}
      >
        <Stack direction="row" gap="16px" flex={1}>
          <Box
            height="43px"
            width="3px"
            borderRadius={"8px"}
            bgcolor={color}
          ></Box>
          <Stack direction="column">
            <Typography fontSize="12px" color={theme.palette.primary.light}>
              Spent
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="bold"
              color={theme.palette.primary.light}
            >
              {`${currencySymbol}${formatNumber(value)}`}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap="16px" flex={1}>
          <Box
            height="43px"
            width="4px"
            borderRadius={"8px"}
            bgcolor={bgColor}
          ></Box>
          <Stack direction="column">
            <Typography fontSize="12px" color={theme.palette.primary.light}>
              {isOverBudget ? "Over Budget" : "Remaining"}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="bold"
              color={theme.palette.primary.light}
            >
              {isOverBudget && "-"}{" "}
              {`${currencySymbol}${formatNumber(remaining)}`}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BudgetsProgressBar;
