import { Stack, Typography, Box } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";

const BillsPage = () => {
  return (
    <>
      <SetTitle title="Recurring Bills" />
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
            Recurring Bills
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default BillsPage;
