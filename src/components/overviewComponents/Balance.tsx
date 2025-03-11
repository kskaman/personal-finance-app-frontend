import { Typography, Stack, useTheme } from "@mui/material";
import { formatNumber } from "../../utils/utilityFunctions";
import { useContext } from "react";
import { BalanceTransactionsDataContext } from "../../context/BalanceTransactionsContext";
import { SettingsContext } from "../../context/SettingsContext";

const Balance = ({ isParentSm }: { isParentSm: boolean }) => {
  const theme = useTheme();
  const balance = useContext(BalanceTransactionsDataContext).balance;
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <>
      <Stack
        width="100%"
        direction={isParentSm ? "column" : "row"}
        flexWrap="wrap"
        gap="24px"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Stack
          flex={1}
          width="100%"
          direction="column"
          gap="6px"
          padding="24px"
          borderRadius="12px"
          bgcolor={theme.palette.primary.main}
        >
          <Typography fontSize="12px" color={theme.palette.text.primary}>
            Current Balance
          </Typography>
          <Typography fontSize="32px" color={theme.palette.text.primary}>
            {`${currencySymbol}${formatNumber(balance.current)}`}
          </Typography>
        </Stack>
        <Stack
          flex={1}
          width="100%"
          direction="column"
          gap="6px"
          padding="24px"
          borderRadius="12px"
          bgcolor={theme.palette.text.primary}
        >
          <Typography fontSize="12px" color={theme.palette.primary.light}>
            Income
          </Typography>
          <Typography fontSize="32px" color={theme.palette.primary.main}>
            {`${currencySymbol}${formatNumber(balance.income)}`}
          </Typography>
        </Stack>
        <Stack
          flex={1}
          width="100%"
          direction="column"
          gap="6px"
          padding="24px"
          borderRadius="12px"
          bgcolor={theme.palette.text.primary}
        >
          <Typography fontSize="12px" color={theme.palette.primary.light}>
            Expenses
          </Typography>
          <Typography fontSize="32px" color={theme.palette.primary.main}>
            {`${currencySymbol}${formatNumber(balance.expenses)}`}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default Balance;
