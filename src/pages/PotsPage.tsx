import { Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PotsProgressBar from "../utilityComponents/PotsProgressBar";
import PageDiv from "../utilityComponents/PageDiv";

const PotsPage = () => {
  return (
    <>
      <SetTitle title="Pots" />
      <PageDiv>
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
      </PageDiv>
    </>
  );
};

export default PotsPage;
