import { Box, Divider, List, ListItem, Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import BudgetsPieChart from "../utilityComponents/BudgetsPieChart";

import PageDiv from "../utilityComponents/PageDiv";
import SubContainer from "../utilityComponents/SubContainer";
import { useContext, useState } from "react";
import {
  BudgetsActionContext,
  BudgetsDataContext,
} from "../context/BudgetsContext";
import { formatNumber } from "../utils/utilityFunctions";
import { BalanceTransactionsDataContext } from "../context/BalanceTransactionsContext";
import { Budget, Transaction } from "../types/Data";
import Button from "../utilityComponents/Button";
import BudgetsItem from "../components/budgetsComponents/BudgetsItem";
import useParentWidth from "../customHooks/useParentWidth";
import { LG_BREAK, MD_SM_BREAK } from "../data/widthConstants";
import DeleteBudgetModal from "../components/modalComponents/DeleteBudgetModal";
import EditBudgetModal from "../components/modalComponents/EditBudgetModal";

const BudgetsPage = () => {
  const { budgets, budgetsTotal } = useContext(BudgetsDataContext);
  const { setBudgets } = useContext(BudgetsActionContext);

  const budgetCategories = budgets.map((budget) => budget.category);
  const colors = budgets.map((budget) => budget.theme);

  const { transactions, monthlySpentByCategory } = useContext(
    BalanceTransactionsDataContext
  );

  const transactionsPerCategory: Record<string, Transaction[]> =
    budgetCategories.reduce<Record<string, Transaction[]>>((acc, category) => {
      acc[category] = transactions.filter(
        (txn: Transaction) => txn.category === category
      );
      return acc;
    }, {} as Record<string, Transaction[]>);

  const monthlySpent: Record<string, number> = budgetCategories.reduce<
    Record<string, number>
  >((acc, category) => {
    acc[category] = monthlySpentByCategory[category] || 0;
    return acc;
  }, {} as Record<string, number>);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteLabel, setDeleteLabel] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const { containerRef, parentWidth } = useParentWidth();
  const isParentLg = parentWidth < LG_BREAK;

  const isParentMdSm = parentWidth < MD_SM_BREAK;

  const handleEditSubmit = ({
    category,
    maxSpend,
    markerTheme,
  }: {
    category: string;
    maxSpend: string;
    markerTheme: string;
  }) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.category === category
          ? { ...budget, maximum: parseFloat(maxSpend), theme: markerTheme }
          : budget
      )
    );
  };

  return (
    <>
      <SetTitle title="Budgets" />
      <Box ref={containerRef}>
        <PageDiv>
          <Stack direction="column" gap="32px">
            {/* Page Heading */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                width="100%"
                height="56px"
                fontSize="32px"
                fontWeight="bold"
                color={theme.palette.primary.main}
              >
                Budgets
              </Typography>
              <Button
                height="53px"
                padding="16px"
                backgroundColor={theme.palette.primary.main}
                color={theme.palette.text.primary}
                onClick={() => console.log("clicked Add New Button")}
                hoverColor={theme.palette.text.primary}
                hoverBgColor={theme.palette.primary.light}
              >
                <Typography noWrap fontSize="14px" fontWeight="bold">
                  + Add New Budget
                </Typography>
              </Button>
            </Stack>

            {/* Budgets summary with doughnut chart */}
            <Stack direction={isParentLg ? "column" : "row"} gap="24px">
              <SubContainer flex={3} height="fit-content">
                <Stack
                  direction={
                    isParentMdSm ? "column" : isParentLg ? "row" : "column"
                  }
                  justifyContent="space-between"
                  alignItems={
                    isParentMdSm
                      ? "center"
                      : isParentLg
                      ? "flex-start"
                      : "center"
                  }
                >
                  <BudgetsPieChart
                    spendings={Object.values(monthlySpent)}
                    limit={budgetsTotal}
                    colors={colors}
                  />

                  <Stack
                    gap="24px"
                    direction="column"
                    width={isParentMdSm ? "100%" : isParentLg ? "50%" : "100%"}
                  >
                    <Typography
                      fontWeight="bold"
                      fontSize="20px"
                      role="heading"
                    >
                      Spending Summary
                    </Typography>
                    <List>
                      {budgets.map((budget, index) => {
                        return (
                          <div key={budget.category}>
                            <ListItem
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                margin: "16px 0",
                                padding: 0,
                                height: "21px",
                                color: theme.palette.primary.light,
                              }}
                            >
                              <Box
                                height="21px"
                                width="4px"
                                bgcolor={budget.theme}
                                borderRadius="8px"
                                marginRight="16px"
                              />
                              <Typography fontSize="14px">
                                {budget.category}
                              </Typography>
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap="4px"
                                marginLeft="auto"
                              >
                                <Typography
                                  fontSize="16px"
                                  fontWeight="bold"
                                  color={theme.palette.primary.main}
                                >
                                  {`$${formatNumber(
                                    monthlySpent[budget.category]
                                  )}`}
                                </Typography>
                                <Typography fontSize="14px">
                                  {`of $${formatNumber(budget.maximum)}`}
                                </Typography>
                              </Stack>
                            </ListItem>
                            {index < budgets.length - 1 && <Divider />}{" "}
                          </div>
                        );
                      })}
                    </List>
                  </Stack>
                </Stack>
              </SubContainer>

              {/* Budgets per category */}
              <Stack flex={5} gap="24px">
                {budgets.map((budget) => {
                  return (
                    <div key={budget.category}>
                      <BudgetsItem
                        setEditModalOpen={() => {
                          setSelectedBudget(budget);
                          setTimeout(() => setEditModalOpen(true), 0);
                        }}
                        setDeleteModalOpen={() => {
                          setDeleteLabel(budget.category);
                          setTimeout(() => setDeleteModalOpen(true));
                        }}
                        budget={budget}
                        monthlySpentForCategory={monthlySpent[budget.category]}
                        transactionsForCategory={
                          transactionsPerCategory[budget.category]
                        }
                      />
                    </div>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>

          {/* Delete Modal Component */}
          <DeleteBudgetModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            label={deleteLabel}
            type="budget"
          />

          {/* Edit Modal Component */}
          <EditBudgetModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedBudget(null);
            }}
            updateBudget={handleEditSubmit}
            category={selectedBudget?.category || ""}
            maximumSpend={selectedBudget?.maximum || 0}
            markerTheme={selectedBudget?.theme || ""}
          />
        </PageDiv>
      </Box>
    </>
  );
};

export default BudgetsPage;
