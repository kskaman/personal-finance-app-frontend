import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SetTitle from "../ui/SetTitle";
import BudgetsPieChart from "./components/BudgetsPieChart";
import PageDiv from "../ui/PageDiv";
import SubContainer from "../ui/SubContainer";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  BudgetsActionContext,
  BudgetsDataContext,
} from "../context/BudgetsContext";
import { formatNumber } from "../utils/utilityFunctions";
import { BalanceTransactionsDataContext } from "../context/BalanceTransactionsContext";
import { Budget, Category, MarkerTheme, Transaction } from "../types/Data";
import Button from "../ui/Button";
import BudgetsItem from "./components/BudgetsItem";
import useParentWidth from "../customHooks/useParentWidth";
import { LG_BREAK, MD_SM_BREAK } from "../data/widthConstants";
import DeleteModal from "../ui/DeleteModal";
import AddEditBudgetModal from "./components/AddEditBudgetModal";
import useModal from "../customHooks/useModal";
import CategoryMarkerContext from "../context/CategoryMarkerContext";
import { updateUsedStatuses } from "../utils/budgetUtils";
import { SettingsContext } from "../context/SettingsContext";
import EmptyStatePage from "../ui/EmptyStatePage";

const BudgetsPage = () => {
  const theme = useTheme();
  const { budgets, budgetsTotal } = useContext(BudgetsDataContext);
  const { setBudgets } = useContext(BudgetsActionContext);
  const { transactions, monthlySpentByCategory } = useContext(
    BalanceTransactionsDataContext
  );
  const { markerThemes, categories, setMarkerThemes, setCategories } =
    useContext(CategoryMarkerContext);
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  const budgetCategories = budgets.map((budget) => budget.category);

  // Memoize computed values for performance.
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

  // Update the usedInBudgets flags for categories and markerThemes whenever budgets change.
  useEffect(() => {
    const { updatedCategories, updatedMarkerThemes } = updateUsedStatuses(
      budgets,
      categories,
      markerThemes
    );
    setCategories(updatedCategories);
    setMarkerThemes(updatedMarkerThemes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets]);

  // Build dropdown options using the updated context arrays.
  const categoryOptions = useMemo(() => {
    return categories.map((cat: Category) => ({
      value: cat.name,
      label: cat.name,
      used: cat.usedInBudgets,
    }));
  }, [categories]);

  const themeOptions = useMemo(() => {
    return markerThemes.map((marker: MarkerTheme) => ({
      value: marker.colorCode,
      label: marker.name,
      used: marker.usedInBudgets,
      colorCode: marker.colorCode,
    }));
  }, [markerThemes]);

  const { containerRef, parentWidth } = useParentWidth();
  const isParentLg = parentWidth < LG_BREAK;
  const isParentMdSm = parentWidth < MD_SM_BREAK;

  // Modal management hooks.
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isAddEditModalOpen,
    openModal: openAddEditModal,
    closeModal: closeAddEditModal,
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

  const handleBudgetDelete = (itemLabel: string) => {
    if (itemLabel === "") return;
    const newBudgets = budgets.filter(
      (budget) => budget.category !== itemLabel
    );
    setBudgets(newBudgets);
    setSelectedBudget(null);
  };

  const sortedBudgets = useMemo(() => {
    return budgets.slice().sort((a, b) => a.category.localeCompare(b.category));
  }, [budgets]);

  if (budgets.length === 0) {
    return (
      <>
        <EmptyStatePage
          message="No Budgets Yet"
          subText="Create your first budget..."
          buttonLabel="Create a Budget"
          onButtonClick={() => {
            setMode("add");
            openAddEditModal();
          }}
        />
        {/* Edit Modal Component */}
        {isAddEditModalOpen && (
          <AddEditBudgetModal
            mode={mode}
            open={isAddEditModalOpen}
            onClose={() => {
              closeAddEditModal();
              setSelectedBudget(null);
              setMode(null);
            }}
            updateBudgets={
              mode === "edit"
                ? handleEditBudget
                : mode === "add"
                ? handleAddBudget
                : () => {}
            }
            categoryOptions={categoryOptions}
            themeOptions={themeOptions}
          />
        )}
      </>
    );
  }

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
                  openAddEditModal();
                }}
                hoverColor={theme.palette.text.primary}
                hoverBgColor={theme.palette.primary.light}
              >
                <Typography noWrap fontSize="14px" fontWeight="bold">
                  {parentWidth < 450 ? "+" : "+ Add New Budget"}
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
                      {sortedBudgets.map((budget, index) => (
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
                                {`${currencySymbol}${formatNumber(
                                  monthlySpent[budget.category]
                                )}`}
                              </Typography>
                              <Typography fontSize="14px">
                                {`of ${currencySymbol}${formatNumber(
                                  budget.maximum
                                )}`}
                              </Typography>
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
                        openAddEditModal();
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
        {isDeleteModalOpen && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => {
              setSelectedBudget(null);
              closeDeleteModal();
            }}
            handleDelete={() =>
              handleBudgetDelete(selectedBudget?.category || "")
            }
            label={selectedBudget?.category || ""}
            type="budget"
          />
        )}

        {/* Edit Modal Component */}
        {isAddEditModalOpen && (
          <AddEditBudgetModal
            mode={mode}
            open={isAddEditModalOpen}
            onClose={() => {
              closeAddEditModal();
              setSelectedBudget(null);
              setMode(null);
            }}
            updateBudgets={
              mode === "edit"
                ? handleEditBudget
                : mode === "add"
                ? handleAddBudget
                : () => {}
            }
            category={selectedBudget?.category}
            maximumSpend={selectedBudget?.maximum}
            markerTheme={selectedBudget?.theme}
            categoryOptions={categoryOptions}
            themeOptions={themeOptions}
          />
        )}
      </Box>
    </>
  );
};

export default BudgetsPage;
