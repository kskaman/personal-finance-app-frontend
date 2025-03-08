import { Box, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { formatNumber } from "../utils/utilityFunctions";
import { lighten } from "@mui/system"; // To lighten colors
import theme from "../theme/theme";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

interface BudgetsPieChartProps {
  spendings: number[];
  limit: number;
  colors: string[];
}

const BudgetsPieChart = ({
  spendings,
  limit,
  colors,
}: BudgetsPieChartProps) => {
  // Outer ring colors
  const chartDataOuter = spendings.map((value, index) => ({
    id: `Spending ${index + 1}`,
    value,
    color: colors[index],
  }));

  // Inner ring colors (lightened)
  const chartDataInner = spendings.map((value, index) => ({
    id: `Spending ${index + 1}`,
    value,
    color: lighten(colors[index], 0.25),
  }));

  const total = spendings.reduce((acc, cur) => acc + cur, 0);

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <Box width={280} height={280} position="relative">
      {/* Centered Text */}
      <Stack
        position="absolute"
        top="50%"
        left="50%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ transform: "translate(-50%, -50%)", zIndex: 2 }}
      >
        <Typography fontSize="32px" color={theme.palette.primary.main}>
          {`${currencySymbol}${formatNumber(total)}`}
        </Typography>
        <Typography fontSize="12px" color={theme.palette.primary.light}>
          of {`${currencySymbol}${formatNumber(limit)}`} limit
        </Typography>
      </Stack>

      {/* Outer Pie Chart */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <PieChart
          width={240}
          height={240}
          series={[
            {
              data: chartDataOuter,
              outerRadius: 120,
              innerRadius: 93.75,
              cx: 115,
              cy: 115,
            },
          ]}
          sx={{
            "& .MuiPieArc-root": {
              stroke: "none",
              strokeWidth: 0,
            },
          }}
        />
      </Box>

      {/* Inner Pie Chart */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <PieChart
          width={240}
          height={240}
          series={[
            {
              data: chartDataInner,
              outerRadius: 93.75,
              innerRadius: 80.625,
              cx: 115,
              cy: 115,
            },
          ]}
          sx={{
            "& .MuiPieArc-root": {
              stroke: "none",
              strokeWidth: 0,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default BudgetsPieChart;
