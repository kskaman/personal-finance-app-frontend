import { Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import SubContainer from "../utilityComponents/SubContainer";
import Filter from "../components/trasactionsComponents/Filter";
import TransactionsTable from "../components/trasactionsComponents/TransactionsTable";
import PageNav from "../components/trasactionsComponents/PageNav";
import { useContext, useState } from "react";
import { BalanceTransactionsDataContext } from "../context/BalanceTransactionsContext";

const TransactionsPage = () => {
  const [pageNum, setPageNum] = useState<number>(() => 1);

  const transactions = useContext(BalanceTransactionsDataContext).transactions;
  const numPages = Math.ceil(transactions.length / 10);

  const numbers = Array.from({ length: numPages }, (_, i) => i + 1);

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum >= 1 && newPageNum <= numbers[numbers.length - 1]) {
      setPageNum(newPageNum);
    }
  };

  // Filter functionality . To be implemented
  const filteredTx = transactions.map((transx) => transx);

  const i = pageNum * 10;
  const selectedTx = filteredTx.slice(i - 10, i);

  return (
    <>
      <SetTitle title="Transactions" />
      <PageDiv>
        <Stack direction="column" gap="32px">
          <Typography
            width="100%"
            height="56px"
            fontSize="32px"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Transactions
          </Typography>
          <SubContainer>
            <Filter />
            <TransactionsTable txns={selectedTx} />

            <PageNav
              numbers={numbers}
              selectedPage={pageNum}
              handlePageSelect={handlePageChange}
            />
          </SubContainer>
        </Stack>
      </PageDiv>
    </>
  );
};

export default TransactionsPage;
