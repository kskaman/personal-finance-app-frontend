import { Box, Stack, Typography, useTheme } from "@mui/material";
import SetTitle from "../ui/SetTitle";
import PageDiv from "../ui/PageDiv";
import { useContext, useState } from "react";
import {
  RecurringActionContext,
  RecurringDataContext,
} from "../context/RecurringContext";
import Total from "./components/Total";
import Summary from "./components/Summary";
import BillsTable from "./components/BillsTable";
import SubContainer from "../ui/SubContainer";
import { RecurringBill, Transaction } from "../types/Data";
import useParentWidth from "../customHooks/useParentWidth";
import { SM_BREAK, XL_BREAK } from "../data/widthConstants";
import DeleteModal from "../ui/DeleteModal";
import useModal from "../customHooks/useModal";
import AddEditBillModal, {
  BillFormValues,
} from "../pots/components/AddEditBillModal";
import Button from "../ui/Button";
import { v4 as uuidv4 } from "uuid";
import { getRandomColor } from "../utils/utilityFunctions";
import { BalanceTransactionsActionContext } from "../context/BalanceTransactionsContext";
import EmptyStatePage from "../ui/EmptyStatePage";
import Filter from "../ui/Filter";

// Function to filter & sort bills.
const filterAndSortBills = (
  bills: RecurringBill[],
  searchName: string,
  sortBy: string
): RecurringBill[] => {
  const filteredBills = bills.filter((bill) =>
    searchName
      ? bill.name.toLowerCase().includes(searchName.toLowerCase().trim())
      : true
  );

  return filteredBills.sort((a, b) => {
    switch (sortBy) {
      case "Latest":
        return Number(a.dueDate) - Number(b.dueDate);
      case "Oldest":
        return Number(b.dueDate) - Number(a.dueDate);
      case "A to Z":
        return a.name.localeCompare(b.name);
      case "Z to A":
        return b.name.localeCompare(a.name);
      case "Highest":
        return a.amount - b.amount;
      case "Lowest":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });
};

const BillsPage = () => {
  const theme = useTheme();
  const { containerRef, parentWidth } = useParentWidth();

  const { recurringBills } = useContext(RecurringDataContext);
  const { setRecurringBills } = useContext(RecurringActionContext);
  // If bill changes should propagate to transactions:
  const { setTransactions } = useContext(BalanceTransactionsActionContext);

  const [searchName, setSearchName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Latest");

  const totalBill = Math.abs(
    recurringBills.reduce((sum, bill) => sum + bill.amount, 0)
  );
  const filteredBills = filterAndSortBills(recurringBills, searchName, sortBy);

  // Modal management hooks.
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

  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();

  // Local state for the selected bill (for edit or delete)
  const [selectedBill, setSelectedBill] = useState<RecurringBill | null>(null);

  // Delete handler.
  const handleBillDelete = (billId: string) => {
    if (!billId) return;
    const newBills = recurringBills.filter(
      (bill: RecurringBill) => bill.id !== billId
    );
    setRecurringBills(newBills);
    setSelectedBill(null);
  };

  // Function to add a new recurring bill.
  const handleAddBill = (formData: BillFormValues) => {
    const newBill: RecurringBill = {
      id: uuidv4(),
      name: formData.name,
      category: formData.category,
      amount: -parseFloat(formData.amount), // store as negative
      dueDate: formData.dueDate,
      recurring: true,
      lastPaid: "", // No payments yet.
      theme: getRandomColor(),
    };
    setRecurringBills((prevBills: RecurringBill[]) => [...prevBills, newBill]);
  };

  // Function to edit an existing recurring bill.
  // Name and category changes will propagate across all related transactions,
  // while changes to Amount and Due Date affect only future transactions.
  const handleEditBill = (formData: BillFormValues, billId: string) => {
    const updatedBills: RecurringBill[] = recurringBills.map((bill) =>
      bill.id === billId
        ? {
            ...bill,
            name: formData.name,
            category: formData.category,
            amount: -parseFloat(formData.amount),
            dueDate: formData.dueDate,
          }
        : bill
    );
    setRecurringBills(updatedBills);

    // Update all transactions linked to this recurring bill (for name and category changes).
    setTransactions((prevTxns: Transaction[]) =>
      prevTxns.map((txn) =>
        txn.recurring && txn.recurringId === billId
          ? { ...txn, name: formData.name, category: formData.category }
          : txn
      )
    );
  };

  if (filteredBills.length === 0) {
    return (
      <>
        <EmptyStatePage
          message="No Bills Yet"
          subText="Track your recurring expenses by adding your first bill."
          buttonLabel="Create a Bill"
          onButtonClick={() => {
            openAddModal();
          }}
        />
        {/* Add Bill Modal (AddEditBillModal in add mode) */}
        {isAddModalOpen && (
          <AddEditBillModal
            open={isAddModalOpen}
            onClose={closeAddModal}
            onSubmit={(formData: BillFormValues) => {
              handleAddBill(formData);
              closeAddModal();
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <SetTitle title="Recurring Bills" />
      <Box ref={containerRef}>
        <PageDiv>
          <Stack direction="column" gap="32px">
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
                Recurring Bills
              </Typography>
              <Button
                height="53px"
                padding="16px"
                backgroundColor={theme.palette.primary.main}
                color={theme.palette.text.primary}
                onClick={openAddModal}
                hoverColor={theme.palette.text.primary}
                hoverBgColor={theme.palette.primary.light}
              >
                <Typography noWrap fontSize="14px" fontWeight="bold">
                  {parentWidth < 450 ? "+" : "+ Add New Bill"}
                </Typography>
              </Button>
            </Stack>
            <Stack
              direction={parentWidth < XL_BREAK ? "column" : "row"}
              gap="24px"
            >
              <Stack
                flex={1}
                gap="24px"
                width="100%"
                minWidth="200px"
                direction={
                  parentWidth > XL_BREAK
                    ? "column"
                    : parentWidth > SM_BREAK
                    ? "row"
                    : "column"
                }
              >
                <Total parentWidth={parentWidth} totalBill={totalBill} />
                <Summary />
              </Stack>
              <SubContainer flex={2}>
                <Stack gap="24px">
                  <Filter
                    parentWidth={parentWidth}
                    searchName={searchName}
                    setSearchName={setSearchName}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                  />
                  <BillsTable
                    parentWidth={parentWidth}
                    bills={filteredBills}
                    setDeleteModalOpen={(bill: RecurringBill) => {
                      setSelectedBill(bill);
                      openDeleteModal();
                    }}
                    setEditModalOpen={(bill: RecurringBill) => {
                      setSelectedBill(bill);
                      openEditModal();
                    }}
                  />
                </Stack>
              </SubContainer>
            </Stack>
          </Stack>
        </PageDiv>

        {/* Delete Modal */}
        {selectedBill && isDeleteModalOpen && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => {
              setSelectedBill(null);
              closeDeleteModal();
            }}
            handleDelete={() => handleBillDelete(selectedBill.id)}
            label={"Recurring Bill"}
            type="bill"
          />
        )}

        {/* Edit Bill Modal (AddEditBillModal in edit mode) */}
        {selectedBill && isEditModalOpen && (
          <AddEditBillModal
            open={isEditModalOpen}
            onClose={() => {
              setSelectedBill(null);
              closeEditModal();
            }}
            onSubmit={(formData: BillFormValues) => {
              handleEditBill(formData, selectedBill.id);
              closeEditModal();
            }}
            billData={{
              id: selectedBill.id,
              name: selectedBill.name,
              category: selectedBill.category,
              amount: Math.abs(selectedBill.amount),
              dueDate: selectedBill.dueDate,
            }}
          />
        )}

        {/* Add Bill Modal (AddEditBillModal in add mode) */}
        {isAddModalOpen && (
          <AddEditBillModal
            open={isAddModalOpen}
            onClose={closeAddModal}
            onSubmit={(formData: BillFormValues) => {
              handleAddBill(formData);
              closeAddModal();
            }}
          />
        )}
      </Box>
    </>
  );
};

export default BillsPage;
