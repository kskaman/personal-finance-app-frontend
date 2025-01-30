import { Link, Stack, Typography } from "@mui/material";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import theme from "../../theme/theme";
import SubContainer from "../../utilityComponents/SubContainer";

const BudgetsOverview = () => {
  return (
    <SubContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          fontWeight="bold"
          fontSize="20px"
          color={theme.palette.primary.main}
        >
          My Budgets
        </Typography>
        <Link
          href="/budgets"
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

export default BudgetsOverview;
