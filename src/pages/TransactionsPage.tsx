import { Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import SubContainer from "../utilityComponents/SubContainer";
import Filter from "../components/trasactionsComponents/Filter";
import TransactionsTable from "../components/trasactionsComponents/TransactionsTable";
import PageNav from "../components/trasactionsComponents/PageNav";
import { useState } from "react";

const TransactionsPage = () => {
  const [pageNum, setPageNum] = useState<number>(() => 1);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum >= 1 && newPageNum <= numbers[numbers.length - 1]) {
      setPageNum(newPageNum);
    }
  };
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
            <TransactionsTable />
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
