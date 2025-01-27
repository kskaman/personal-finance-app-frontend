import { Box, Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";

const TransactionsPage = () => {
  return (
    <>
      <SetTitle title="Transactions" />
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
            Transactions
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default TransactionsPage;
