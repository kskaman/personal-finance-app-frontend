import { Stack, Box, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PotsProgressBar from "../utilityComponents/PotsProgressBar";

const PotsPage = () => {
  return (
    <>
      <SetTitle title="Pots" />
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
            Pots
          </Typography>
          <Stack direction="row" gap="24px">
            <PotsProgressBar
              value={159}
              target={2000}
              color={theme.palette.secondary.main}
              bgColor={theme.palette.background.default}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default PotsPage;
