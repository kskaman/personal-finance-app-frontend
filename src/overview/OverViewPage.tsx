import SetTitle from "../ui/SetTitle";
import { Box, Stack, Typography, useTheme } from "@mui/material";

import Balance from "./components/Balance";
import TransactionsOverview from "./components/TransactionsOverview";
import PotsOverview from "./components/PotsOverview";
import BudgetsOverview from "./components/BudgetsOverview";
import BillsOverview from "./components/BillsOverview";
import PageDiv from "../ui/PageDiv";
import useParentWidth from "../customHooks/useParentWidth";
import { LG_BREAK, SM_BREAK } from "../data/widthConstants";
import { useContext } from "react";
import { BalanceTransactionsDataContext } from "../context/BalanceTransactionsContext";
import { PotsDataContext } from "../context/PotsContext";
import { BudgetsDataContext } from "../context/BudgetsContext";
import { RecurringDataContext } from "../context/RecurringContext";
import { useNavigate } from "react-router";
import EmptyStatePage from "../ui/EmptyStatePage";

const OverViewPage = () => {
  const { containerRef, parentWidth } = useParentWidth();
  const isParentLg = parentWidth < LG_BREAK;
  const isParentSm = parentWidth < SM_BREAK;

  const theme = useTheme();

  const navigate = useNavigate();

  // Grabbing data from your contexts
  const { balance, transactions } = useContext(BalanceTransactionsDataContext);
  const { pots } = useContext(PotsDataContext);
  const { budgets } = useContext(BudgetsDataContext);
  const { recurringBills } = useContext(RecurringDataContext);

  // Decide if there is any data at all
  const hasNonZeroBalance =
    balance.current !== 0 || balance.income !== 0 || balance.expenses !== 0;

  const hasTransactions = transactions.length > 0;
  const hasPots = pots.length > 0;
  const hasBudgets = budgets.length > 0;
  const hasBills = recurringBills.length > 0;

  const hasAnyData =
    hasNonZeroBalance || hasTransactions || hasPots || hasBudgets || hasBills;

  // If absolutely everything is empty, show a single empty-state layout:
  if (!hasAnyData) {
    return (
      <>
        <SetTitle title="Overview" />
        <EmptyStatePage
          message="No Data Yet"
          subText="You haven't added any balances, transactions, pots, budgets or bills. Let's get started!"
          buttonLabel="Go to Transactions Page"
          onButtonClick={() => {
            navigate("/transactions");
          }}
        />
      </>
    );
  }

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
                {hasPots && <PotsOverview />}
                {hasTransactions && <TransactionsOverview />}
              </Stack>
              <Stack
                direction="column"
                gap="24px"
                width={isParentLg ? "100%" : "50%"}
              >
                {hasBudgets && <BudgetsOverview />}
                {hasBills && <BillsOverview />}
              </Stack>
            </Stack>
          </Stack>
        </PageDiv>
      </Box>
    </>
  );
};

export default OverViewPage;
