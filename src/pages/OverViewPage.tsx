import SetTitle from "../components/SetTitle";
import { Box, Stack, Typography } from "@mui/material";
import theme from "../theme/theme";
import Balance from "../components/overviewComponents/Balance";
import TransactionsOverview from "../components/overviewComponents/TransactionsOverview";
import PotsOverview from "../components/overviewComponents/PotsOverview";
import BudgetsOverview from "../components/overviewComponents/BudgetsOverview";
import BillsOverview from "../components/overviewComponents/BillsOverview";
import PageDiv from "../utilityComponents/PageDiv";
import useParentWidth from "../customHooks/useParentWidth";
import { LG_BREAK, SM_BREAK } from "../data/widthConstants";

const OverViewPage = () => {
  const { containerRef, parentWidth } = useParentWidth();
  const isParentLg = parentWidth < LG_BREAK;
  const isParentSm = parentWidth < SM_BREAK;
  return (
    <>
      <SetTitle title="OverView" />
      <Box ref={containerRef}>
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

            <Balance isParentSm={isParentSm} />
            <Stack
              direction={isParentLg ? "column" : "row"}
              gap="24px"
              width="100%"
            >
              <Stack
                direction="column"
                gap="24px"
                width={isParentLg ? "100%" : "50%"}
              >
                <PotsOverview />
                <TransactionsOverview />
              </Stack>
              <Stack
                direction="column"
                gap="24px"
                width={isParentLg ? "100%" : "50%"}
              >
                <BudgetsOverview />
                <BillsOverview />
              </Stack>
            </Stack>
          </Stack>
        </PageDiv>
      </Box>
    </>
  );
};

export default OverViewPage;
