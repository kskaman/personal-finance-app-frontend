import { Stack, Box, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import BudgetsPieChart from "../utilityComponents/BudgetsPieChart";
import BudgetsProgressBar from "../utilityComponents/BudgetsProgressBar";

const BudgetsPage = () => {
  const colors = [
    theme.palette.secondary.main,
    theme.palette.secondary.light,
    theme.palette.text.secondary,
    theme.palette.others.navy,
  ];
  return (
    <>
      <SetTitle title="Budgets" />
      <Box
        bgcolor={theme.palette.background.default}
        height="100%"
        width="100%"
        sx={{
          px: { xs: 2, sm: 5 },
          py: 4,
        }}
      >
        <Stack direction="column" gap="32px">
          <Typography
            width="100%"
            height="56px"
            fontSize="32px"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Budgets
          </Typography>
          <Stack direction="row" gap="24px">
            <BudgetsPieChart
              spendings={[15, 150, 133, 40]}
              limit={975}
              colors={colors}
            />
          </Stack>
          <Stack direction="row" gap="24px" width="100%">
            <Stack direction="column" gap="24px" width="100%">
              <BudgetsProgressBar
                value={15}
                total={50}
                color={theme.palette.secondary.main}
                bgColor={theme.palette.background.default}
              />
            </Stack>
            <Stack direction="column" gap="24px" width="100%">
              <BudgetsProgressBar
                value={65}
                total={50}
                color={theme.palette.secondary.main}
                bgColor={theme.palette.background.default}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default BudgetsPage;
