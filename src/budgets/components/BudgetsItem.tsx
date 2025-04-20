import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { useContext } from "react";
import { Budget, Transaction } from "../../types/Data";
import useModal from "../../customHooks/useModal";
import { SettingsContext } from "../../context/SettingsContext";
import SubContainer from "../../ui/SubContainer";
import OptionsButton from "../../ui/OptionsButton";
import BudgetsProgressBar from "./BudgetsProgressBar";
import CaretRightIcon from "../../Icons/CaretRightIcon";
import {
  formatDateToReadable,
  formatNumber,
  getInitials,
} from "../../utils/utilityFunctions";
import BudgetTransactionsModal from "./BudgetTransactionsModal";

interface BudgetItemProps {
  budget: Budget;
  monthlySpentForCategory: number;
  transactionsForCategory: Transaction[];
  setEditModalOpen: () => void;
  setDeleteModalOpen: () => void;
}

const BudgetsItem = ({
  budget,
  monthlySpentForCategory,
  transactionsForCategory,
  setDeleteModalOpen,
  setEditModalOpen,
}: BudgetItemProps) => {
  const theme = useTheme();

  const {
    isOpen: isDetailOpen,
    openModal: openDetails,
    closeModal: closeDetails,
  } = useModal();

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <>
      <SubContainer gap="20px">
        <Stack direction="row" alignItems="center" gap="24px">
          <Box
            width="20px"
            height="20px"
            borderRadius="50%"
            bgcolor={budget.theme}
          ></Box>
          <Typography
            role="heading"
            fontSize="20px"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            {budget.category}
          </Typography>
          <OptionsButton
            type="budget"
            onEdit={setEditModalOpen}
            onDelete={setDeleteModalOpen}
          />
        </Stack>
        <BudgetsProgressBar
          value={monthlySpentForCategory}
          total={budget.maximum}
          color={budget.theme}
          bgColor={theme.palette.background.default}
        />
        <SubContainer bgColor={theme.palette.background.default}>
          <Stack direction="row">
            <Typography
              fontWeight="bold"
              fontSize="16px"
              color={theme.palette.primary.main}
            >
              Latest Spending
            </Typography>
            <Stack
              gap="12px"
              direction="row"
              marginLeft="auto"
              alignItems="center"
              sx={{
                cursor: "pointer",
              }}
              onClick={openDetails}
            >
              <Typography
                color={theme.palette.primary.light}
                sx={{
                  ":hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                See All
              </Typography>
              <CaretRightIcon color={theme.palette.primary.light} />
            </Stack>
          </Stack>
          <List>
            {transactionsForCategory.slice(0, 3).map((transaction, index) => {
              return (
                <div key={transaction.id}>
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
                      {transaction.amount >= 0 ? (
                        <Typography
                          fontSize="14px"
                          fontWeight="bold"
                          color={theme.palette.secondary.main}
                        >
                          +
                          {`${currencySymbol}${formatNumber(
                            transaction.amount
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
                  {index < 2 && (
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
        </SubContainer>
      </SubContainer>

      {isDetailOpen && (
        <BudgetTransactionsModal
          open={isDetailOpen}
          onClose={closeDetails}
          categoryLabel={budget.category}
          transactionsForCategory={transactionsForCategory}
        />
      )}
    </>
  );
};

export default BudgetsItem;
