import { Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";

const BillsPage = () => {
  return (
    <>
      <SetTitle title="Recurring Bills" />
      <PageDiv>
        <Stack direction="column" gap="32px">
          <Typography
            width="100%"
            height="56px"
            fontSize="32px"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Recurring Bills
          </Typography>
        </Stack>
      </PageDiv>
    </>
  );
};

export default BillsPage;
