import { Link, Stack, Typography, useTheme } from "@mui/material";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import SubContainer from "../../utilityComponents/SubContainer";
import { useContext } from "react";
import { RecurringDataContext } from "../../context/RecurringContext";
import { formatNumber } from "../../utils/utilityFunctions";
import { SettingsContext } from "../../context/SettingsContext";

const BillsOverview = () => {
  const theme = useTheme();
  const { recurringSummary } = useContext(RecurringDataContext);

  const summaryData = {
    paid: { label: "Paid Bills", borderColor: theme.palette.others.green },
    unpaid: {
      label: "Total Upcoming",
      borderColor: theme.palette.others.yellow,
    },
    dueSoon: { label: "Due Soon", borderColor: theme.palette.others.cyan },
    due: { label: "Due", borderColor: theme.palette.others.red },
  };
  const showDue = recurringSummary.due.count !== 0;

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

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
      <Stack gap="12px">
        {Object.entries(recurringSummary)
          .filter(([key]) => key !== "due" || showDue)
          .map(([key, summary]) => {
            const typedKey = key as keyof typeof summaryData;
            //! you access summaryData[typedKey] more than once, I would set it here as a variable

            const isDue = typedKey === "due";

            return (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding="20px 16px"
                borderRadius="8px"
                borderLeft={`4px solid ${summaryData[typedKey].borderColor}`}
                bgcolor={theme.palette.background.default}
              >
                <Typography
                  fontSize="14px"
                  fontWeight={isDue ? "bold" : "normal"}
                  color={
                    isDue
                      ? theme.palette.others.red
                      : theme.palette.primary.light
                  }
                >
                  {summaryData[typedKey].label}
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight="bold"
                  color={
                    isDue
                      ? theme.palette.others.red
                      : theme.palette.primary.main
                  }
                >
                  {`${currencySymbol}${formatNumber(summary.total)}`}
                </Typography>
              </Stack>
            );
          })}
      </Stack>
    </SubContainer>
  );
};

export default BillsOverview;
