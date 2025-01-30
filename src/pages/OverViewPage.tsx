import SetTitle from "../components/SetTitle";
import { Stack, Typography } from "@mui/material";
import theme from "../theme/theme";
import Balance from "../components/overviewComponents/Balance";
import TransactionsOverview from "../components/overviewComponents/TransactionsOverview";
import PotsOverview from "../components/overviewComponents/PotsOverview";
import BudgetsOverview from "../components/overviewComponents/BudgetsOverview";
import BillsOverview from "../components/overviewComponents/BillsOverview";
import PageDiv from "../utilityComponents/PageDiv";

const OverViewPage = () => {
  return (
    <>
      <SetTitle title="OverView" />
      <PageDiv>
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
      </PageDiv>
    </>
  );
};

export default OverViewPage;
