import { Box, Stack, Typography, useTheme } from "@mui/material";
import { formatNumber } from "../../utils/utilityFunctions";
import { SettingsContext } from "../../context/SettingsContext";
import { useContext } from "react";

interface PotsProgressBarProps {
  type: "addMoney" | "withdraw" | null;
  oldValue: number; // The pot total before the change
  valueChange: number; // The amount to add or withdraw (a positive number)
  target: number;
  color: string; // The color for the change segment (green for add, red for withdraw)
  bgColor: string; // The background color for the rest of the bar
}

const PotsProgressBar = ({
  type,
  oldValue,
  valueChange,
  target,
  color,
  bgColor,
}: PotsProgressBarProps) => {
  const theme = useTheme();

  let containerPercentage = 0;
  let blackPercentage = 0;
  let changePercentage = 0;
  let displayedValue = 0;

  // Determine if the entered value is valid:
  // For addMoney: valueChange must be >= 0 and not exceed (target - oldValue)
  // For withdraw: valueChange must be >= 0 and not exceed oldValue
  const isValid =
    type === "addMoney"
      ? valueChange >= 0 && valueChange <= target
      : type === "withdraw"
      ? valueChange >= 0 && valueChange <= oldValue
      : false;

  if (type === "addMoney") {
    const newTotal = oldValue + (isValid ? valueChange : 0);
    displayedValue = newTotal;
    // Container is based on the new total percentage
    containerPercentage = Math.min((newTotal / target) * 100, 100);
    // Black part remains the old value
    blackPercentage = Math.min((oldValue / target) * 100, containerPercentage);
    changePercentage = containerPercentage - blackPercentage;
  } else if (type === "withdraw") {
    // For withdraw, container stays as the old value (visual container remains constant)
    containerPercentage = Math.min((oldValue / target) * 100, 100);
    const newTotal = oldValue - (isValid ? valueChange : 0);
    displayedValue = newTotal;
    // Black part represents the new total after withdrawal
    blackPercentage = Math.min((newTotal / target) * 100, containerPercentage);
    changePercentage = containerPercentage - blackPercentage;
  }

  // The percentage to display below the bar is always based on the new total
  const newTotalPercentage = Math.min((displayedValue / target) * 100, 100);

  const singleBlackOnly = blackPercentage > 0 && changePercentage === 0;

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
          New Amount
        </Typography>
        <Typography fontSize="32px" color={theme.palette.primary.main}>
          {displayedValue < 0
            ? `-${currencySymbol}${formatNumber(Math.abs(displayedValue))}`
            : `${currencySymbol}${formatNumber(displayedValue)}`}
        </Typography>
      </Stack>
      {/* Custom dual-color progress bar */}
      <Box
        position="relative"
        width="100%"
        height="8px"
        borderRadius="4px"
        overflow="hidden"
        bgcolor={bgColor}
      >
        {/* Entire bar container uses bgColor by default */}
        <Stack
          position="absolute"
          top={0}
          left={0}
          width={`${containerPercentage}%`}
          height="100%"
          direction="row"
          gap="2px"
        >
          {/* Black segment: for addMoney, it's the old value;
              for withdraw, it is the new total */}
          <Box
            width={`calc(${blackPercentage}% - 1px)`}
            height="100%"
            sx={{
              backgroundColor: "black",
              // Rounded on the left side
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopRightRadius: singleBlackOnly ? "4px" : "0px",
              borderBottomRightRadius: singleBlackOnly ? "4px" : "0px",
            }}
          />
          {/* Colored segment: for addMoney, it's the addition; for withdraw, it's the withdrawn portion */}
          <Box
            width={`calc(${changePercentage}% - 1px)`}
            height="100%"
            sx={{
              backgroundColor: color,
              // Rounded on the right side
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          />
        </Stack>
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "18px" }}
      >
        <Typography fontSize="12px" color={theme.palette.primary.light}>
          {newTotalPercentage.toFixed(2)}%
        </Typography>
        <Typography fontSize="12px" color={theme.palette.primary.light}>
          Target of {`${currencySymbol}${formatNumber(target)}`}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PotsProgressBar;
