import { Box, Divider, List, ListItem, Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import BudgetsPieChart from "../utilityComponents/BudgetsPieChart";
import PageDiv from "../utilityComponents/PageDiv";
import SubContainer from "../utilityComponents/SubContainer";
import { useContext, useMemo, useState } from "react";
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
import DeleteModal from "../components/modalComponents/DeleteModal";
import AddEditBudgetModal from "../components/modalComponents/AddEditBudgetModal";
import useModal from "../customHooks/useModal";

const BudgetsPage = () => {
  const { budgets, budgetsTotal } = useContext(BudgetsDataContext);
  const { setBudgets } = useContext(BudgetsActionContext);
  const { transactions, monthlySpentByCategory } = useContext(
    BalanceTransactionsDataContext
  );

  const budgetCategories = budgets.map((budget) => budget.category);

  // Memoize computed values for performance
  const transactionsPerCategory = useMemo(() => {
    return budgetCategories.reduce<Record<string, Transaction[]>>(
      (acc, category) => {
        acc[category] = transactions.filter(
          (txn: Transaction) => txn.category === category
        );
        return acc;
      },
      {}
    );
  }, [budgetCategories, transactions]);

  const monthlySpent = useMemo(() => {
    return budgetCategories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = monthlySpentByCategory[category] || 0;
      return acc;
    }, {});
  }, [budgetCategories, monthlySpentByCategory]);

  const { containerRef, parentWidth } = useParentWidth();
  const isParentLg = parentWidth < LG_BREAK;
  const isParentMdSm = parentWidth < MD_SM_BREAK;

  // Use custom modal hooks for managing modal states
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  // Local state for the selected budget (for edit/delete)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [mode, setMode] = useState<"edit" | "add" | null>(null);

  const handleEditBudget = ({
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

  const handleAddBudget = ({
    category,
    maxSpend,
    markerTheme,
  }: {
    category: string;
    maxSpend: string;
    markerTheme: string;
  }) => {
    setBudgets((prevBudgets) => [
      ...prevBudgets,
      { category, maximum: parseFloat(maxSpend), theme: markerTheme },
    ]);
  };

  const handleBudgetDelete = ({ category }: { category: string }) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.category !== category)
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
                onClick={() => {
                  setMode("add");
                  openEditModal();
                }}
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
                    colors={budgets.map((b) => b.theme)}
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
                      {budgets.map((budget, index) => (
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
                              <Typography fontSize="14px">{`of $${formatNumber(
                                budget.maximum
                              )}`}</Typography>
                            </Stack>
                          </ListItem>
                          {index < budgets.length - 1 && <Divider />}
                        </div>
                      ))}
                    </List>
                  </Stack>
                </Stack>
              </SubContainer>

              {/* Budgets per category */}
              <Stack flex={5} gap="24px">
                {budgets.map((budget) => (
                  <div key={budget.category}>
                    <BudgetsItem
                      setEditModalOpen={() => {
                        setSelectedBudget(budget);
                        setMode("edit");
                        openEditModal();
                      }}
                      setDeleteModalOpen={() => {
                        setSelectedBudget(budget);
                        openDeleteModal();
                      }}
                      budget={budget}
                      monthlySpentForCategory={monthlySpent[budget.category]}
                      transactionsForCategory={
                        transactionsPerCategory[budget.category]
                      }
                    />
                  </div>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </PageDiv>

        {/* Delete Modal Component */}
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          handleDelete={() =>
            handleBudgetDelete({ category: selectedBudget?.category || "" })
          }
          label={selectedBudget?.category || ""}
          type="budget"
        />

        {/* Edit Modal Component */}
        <AddEditBudgetModal
          mode={mode}
          open={isEditModalOpen}
          onClose={() => {
            closeEditModal();
            setSelectedBudget(null);
          }}
          updateBudget={
            mode === "edit"
              ? handleEditBudget
              : mode === "add"
              ? handleAddBudget
              : () => {}
          }
          category={selectedBudget?.category || ""}
          maximumSpend={selectedBudget?.maximum || 0}
          markerTheme={selectedBudget?.theme || ""}
        />
      </Box>
    </>
  );
};

export default BudgetsPage;
