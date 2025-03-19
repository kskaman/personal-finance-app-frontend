import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import SubContainer from "../../utilityComponents/SubContainer";
import { useContext } from "react";
import { BalanceTransactionsDataContext } from "../../context/BalanceTransactionsContext";
import { BudgetsDataContext } from "../../context/BudgetsContext";
import BudgetsPieChart from "../../utilityComponents/BudgetsPieChart";
import { formatNumber } from "../../utils/utilityFunctions";
import useParentWidth from "../../customHooks/useParentWidth";
import { SettingsContext } from "../../context/SettingsContext";

const BudgetsOverview = () => {
  const theme = useTheme();
  const { budgets, budgetsTotal } = useContext(BudgetsDataContext);
  const { monthlySpentByCategory } = useContext(
    BalanceTransactionsDataContext
  ) as {
    monthlySpentByCategory: Record<string, number>;
  };

  //! you are mapping over the budgets array twice to get the colorsArr and budgetCategories and then reducing budgetCategories into monthlySpent. You can do this in one reduce function
  // const { colorsArr, monthlySpent } = budgets.reduce(
  //   (acc, budget) => {
  //     acc.colorsArr.push(budget.theme);
  //     acc.monthlySpent[budget.category] =
  //       monthlySpentByCategory[budget.category] || 0;
  //     return acc;
  //   },
  //   { colorsArr: [] as string[], monthlySpent: {} as Record<string, number> }
  // );

  const colorsArr = budgets.map((budget) => budget.theme);

  const budgetCategories = budgets.map((budget) => budget.category);
  const monthlySpent: Record<string, number> = budgetCategories.reduce<
    Record<string, number>
  >((acc, category) => {
    acc[category] = monthlySpentByCategory[category] || 0;
    return acc;
  }, {} as Record<string, number>);

  const monthlySpentValues = Object.values(monthlySpent);

  const { containerRef, parentWidth } = useParentWidth();

  const isParentWidth = parentWidth < 600;
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <Box ref={containerRef}>
      <SubContainer>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            fontWeight="bold"
            fontSize="20px"
            color={theme.palette.primary.main}
          >
            My Budgets
          </Typography>
          <Link
            href="/budgets"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="12px"
            underline="none"
          >
            <Typography
              fontSize="14px"
              color={theme.palette.primary.light}
              sx={{
                ":hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              See Details
            </Typography>
            <CaretRightIcon color={theme.palette.primary.light} />
          </Link>
        </Stack>
        <Stack
          direction={isParentWidth ? "column" : "row"}
          gap="32px"
          justifyContent={isParentWidth ? "flex-start" : "space-evenly"}
        >
          <Stack alignItems="center" justifyContent="center">
            <BudgetsPieChart
              spendings={monthlySpentValues}
              limit={budgetsTotal}
              colors={colorsArr}
            />
          </Stack>

          <Grid
            container
            rowSpacing="24px"
            columnSpacing="24px"
            columns={isParentWidth ? 2 : 1}
            width={isParentWidth ? "100%" : "40%"}
          >
            {budgets.map((budget) => (
              <Grid
                key={budget.category}
                size={1}
                maxHeight={isParentWidth ? "100%" : "20%"}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Colored Bar */}
                <Box
                  height="100%"
                  width="3px"
                  borderRadius="8px"
                  bgcolor={budget.theme}
                />

                {/* Pot Details */}
                <Stack direction="column">
                  <Typography
                    fontSize="12px"
                    color={theme.palette.primary.light}
                  >
                    {budget.category}
                  </Typography>
                  <Typography
                    fontSize="14px"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    {`${currencySymbol}${formatNumber(budget.maximum)}`}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </SubContainer>
    </Box>
  );
};

export default BudgetsOverview;
