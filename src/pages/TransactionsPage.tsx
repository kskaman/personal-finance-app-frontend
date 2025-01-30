import { Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";

const TransactionsPage = () => {
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
        </Stack>
      </PageDiv>
    </>
  );
};

export default TransactionsPage;
