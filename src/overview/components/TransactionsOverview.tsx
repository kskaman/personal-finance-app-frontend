import {
  Avatar,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext } from "react";

import {
  formatDateToReadable,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import SubContainer from "../../ui/SubContainer";
import { BalanceTransactionsDataContext } from "../../context/BalanceTransactionsContext";
import { SettingsContext } from "../../context/SettingsContext";
import { Link } from "react-router";

const TransactionsOverview = () => {
  const theme = useTheme();
  const latestTransactions = useContext(
    BalanceTransactionsDataContext
  ).transactions.slice(0, 5);

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <SubContainer gap="32px">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          fontWeight="bold"
          fontSize="20px"
          color={theme.palette.primary.main}
        >
          Transactions
        </Typography>
        <Link
          to="/app/bills"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            textDecoration: "none",
          }}
        >
          <Typography
            fontSize="14px"
            color={theme.palette.primary.light}
            sx={{
              whiteSpace: "nowrap",
              ":hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            View All
          </Typography>
          <CaretRightIcon color={theme.palette.primary.light} />
        </Link>
      </Stack>

      <List>
        {latestTransactions.map((transaction, index) => (
          <div key={transaction.id}>
            <ListItem
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0",
              }}
            >
              {/* Rounded Avatar with initials */}
              <Avatar
                sx={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: theme.palette.primary.contrastText,
                  backgroundColor: transaction.theme,
                  width: "40px",
                  height: "40px",
                  marginRight: "16px",
                }}
              >
                {getInitials(transaction.name)}
              </Avatar>
              <Typography
                fontSize="14px"
                fontWeight="bold"
                color={theme.palette.primary.main}
              >
                {transaction.name}
              </Typography>

              <Stack
                marginLeft="auto"
                justifyContent="center"
                alignItems="flex-end"
              >
                {transaction.amount >= 0 ? (
                  <Typography
                    fontSize="14px"
                    fontWeight="bold"
                    color={theme.palette.secondary.main}
                  >
                    +
                    {`${currencySymbol}${formatNumber(
                      Math.abs(transaction.amount)
                    )}`}
                  </Typography>
                ) : (
                  <Typography
                    fontSize="14px"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    -
                    {`${currencySymbol}${formatNumber(
                      Math.abs(transaction.amount)
                    )}`}
                  </Typography>
                )}
                <Typography fontSize="12px" color={theme.palette.primary.light}>
                  {formatDateToReadable(transaction.date)}
                </Typography>
              </Stack>
            </ListItem>
            {index < latestTransactions.length - 1 && <Divider />}{" "}
            {/* Add divider between items */}
          </div>
        ))}
      </List>
    </SubContainer>
  );
};

export default TransactionsOverview;
