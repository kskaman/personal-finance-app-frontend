import SetTitle from "../components/SetTitle";
import { Box, Stack, Typography } from "@mui/material";
import theme from "../theme/theme";
import Balance from "../components/overviewComponents/Balance";
import TransactionsOverview from "../components/overviewComponents/TransactionsOverview";
import PotsOverview from "../components/overviewComponents/PotsOverview";
import BudgetsOverview from "../components/overviewComponents/BudgetsOverview";
import BillsOverview from "../components/overviewComponents/BillsOverview";

const OverViewPage = () => {
  return (
    <>
      <SetTitle title="OverView" />
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
            Overview
          </Typography>

          <Balance />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            gap="24px"
            width="100%"
          >
            <Stack
              direction="column"
              gap="24px"
              width={{ xs: "100%", lg: "50%" }}
            >
              <PotsOverview />
              <TransactionsOverview />
            </Stack>
            <Stack
              direction="column"
              gap="24px"
              width={{ xs: "100%", lg: "50%" }}
            >
              <BudgetsOverview />
              <BillsOverview />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default OverViewPage;
