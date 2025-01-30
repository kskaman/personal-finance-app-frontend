import { Link, Stack, Typography } from "@mui/material";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import theme from "../../theme/theme";
import SubContainer from "../../utilityComponents/SubContainer";

const BillsOverview = () => {
  return (
    <SubContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          fontWeight="bold"
          fontSize="20px"
          color={theme.palette.primary.main}
        >
          Recurring Bills
        </Typography>
        <Link
          href="/bills"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="12px"
          underline="none"
        >
          <Typography
            fontSize="14px"
            color={theme.palette.primary.light}
            sx={{
              ":hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            See Details
          </Typography>
          <CaretRightIcon color={theme.palette.primary.light} />
        </Link>
      </Stack>
      <Stack></Stack>
    </SubContainer>
  );
};

export default BillsOverview;
