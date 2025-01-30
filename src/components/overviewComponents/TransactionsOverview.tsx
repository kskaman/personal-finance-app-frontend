import {
  Avatar,
  Divider,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../../context/DataContexts";
import {
  formatDateToReadable,
  formatNumber,
  getInitials,
  getRandomColor,
} from "../../utils/utilityFunctions";
import theme from "../../theme/theme";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import SubContainer from "../../utilityComponents/SubContainer";

const TransactionsOverview = () => {
  const latestTransactions = useContext(DataContext).transactions.slice(0, 5);

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
          href="/transactions"
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
            View All
          </Typography>
          <CaretRightIcon color={theme.palette.primary.light} />
        </Link>
      </Stack>

      <List>
        {latestTransactions.map((transaction, index) => (
          <div key={transaction.date}>
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
                  backgroundColor: getRandomColor(),
                  width: "40px",
                  height: "40px",
                  marginRight: "16px",
                }}
              >
                {getInitials(transaction.name)}
              </Avatar>
              <Typography fontSize="14px" fontWeight="bold">
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
                    +${formatNumber(transaction.amount)}
                  </Typography>
                ) : (
                  <Typography
                    fontSize="14px"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    -${formatNumber(Math.abs(transaction.amount))}
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
