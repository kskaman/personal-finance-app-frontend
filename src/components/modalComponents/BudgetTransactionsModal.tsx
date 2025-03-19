import {
  Avatar,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  formatDateToReadable,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import { Transaction } from "../../types/Data";
import ActionModal from "./ActionModal";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

const BudgetTransactionsModal = ({
  open,
  onClose,
  transactionsForCategory,
  categoryLabel,
}: {
  open: boolean;
  onClose: () => void;

  transactionsForCategory: Transaction[];
  categoryLabel: string;
}) => {
  const theme = useTheme();
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <ActionModal open={open} onClose={onClose} heading={categoryLabel}>
      <List>
        {transactionsForCategory.map((transaction, index) => {
          return (
            //! You can use a fragment (<> </>) here instead of a div to avoid adding an extra div to the DOM
            //! date isn't a great key as there is no guarantee that it will be unique. If you have a unique id for each transaction, that would be a better key
            <div key={transaction.date}>
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "12px 0",
                  padding: 0,
                  height: "40px",
                  color: theme.palette.primary.light,
                }}
              >
                //! I have seen this Avater code repeated several times, you
                could make it it's own component to avoid duplicate code. The
                only thing that seems to changes sometimes is width and height
                so those could be based off a prop
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
                <Typography fontSize="14px" fontWeight="bold">
                  {transaction.name}
                </Typography>
                <Stack
                  marginLeft="auto"
                  justifyContent="center"
                  alignItems="flex-end"
                >
                  //! as mentioned previously, extracting an is positive check
                  and then using that for single line rendering would be cleaner
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
                  <Typography
                    fontSize="12px"
                    color={theme.palette.primary.light}
                  >
                    {formatDateToReadable(transaction.date)}
                  </Typography>
                </Stack>
              </ListItem>
              //! could also be checked as index !==
              transactionsForCategory.length - 1. Bother are fine, I personally
              think the !== is more readable
              {index < transactionsForCategory.length - 1 && (
                <Divider
                  sx={{
                    width: "100%", // Ensure the divider spans across
                    color: theme.palette.primary.light,
                    marginTop: "8px",
                  }}
                />
              )}
            </div>
          );
        })}
      </List>
    </ActionModal>
  );
};

export default BudgetTransactionsModal;
