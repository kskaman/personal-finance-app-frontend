import { Box, Stack, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import SubContainer from "../utilityComponents/SubContainer";
import Filter from "../utilityComponents/Filter";
import TransactionsTable from "../components/transactionsComponents/TransactionsTable";
import PageNav from "../components/transactionsComponents/PageNav";
import { useContext, useState } from "react";
import {
  BalanceTransactionsActionContext,
  BalanceTransactionsDataContext,
} from "../context/BalanceTransactionsContext";
import { RecurringBill, Transaction } from "../types/Data";
import useParentWidth from "../customHooks/useParentWidth";
import Button from "../utilityComponents/Button";
import useModal from "../customHooks/useModal";
import DeleteModal from "../components/modalComponents/DeleteModal";
import {
  RecurringActionContext,
  RecurringDataContext,
} from "../context/RecurringContext";
import AddEditTransactionModal from "../components/modalComponents/AddEditTransactionModal";
import {
  formatDecimalNumber,
  formatISODateToDDMMYYYY,
} from "../utils/utilityFunctions";

// Interfaces and Props
interface FormValues {
  txnName: string;
  category: string;
  date: string;
  amount: string;
  paymentType: "oneTime" | "recurring";
  paymentDirection: "paid" | "received";
  recurringId?: string;
  dueDate?: string;
}

// Helper function
const filterAndSortTransactions = (
  transactions: Transaction[],
  searchName: string,
  category: string,
  sortBy: string
): Transaction[] => {
  const filteredTx = transactions.filter((txn) => {
    const matchesSearch = searchName
      ? txn.name.toLowerCase().includes(searchName.toLowerCase().trim())
      : true;

    const matchesCategory =
      category === "All Transactions" || txn.category === category;

    return matchesSearch && matchesCategory;
  });

  // Sorting Logic
  return filteredTx.sort((a, b) => {
    switch (sortBy) {
      case "Latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "Oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
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

// Main Page component
const TransactionsPage = () => {
  const { containerRef, parentWidth } = useParentWidth();

  const [pageNum, setPageNum] = useState<number>(() => 1);

  const { transactions, balance } = useContext(BalanceTransactionsDataContext);
  const { setTransactions, setBalance } = useContext(
    BalanceTransactionsActionContext
  );

  const recurringBills = useContext(RecurringDataContext).recurringBills;
  const { setRecurringBills } = useContext(RecurringActionContext);

  const numPages = Math.ceil(transactions.length / 10);

  const numbers = Array.from({ length: numPages }, (_, i) => i + 1);

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum >= 1 && newPageNum <= numbers[numbers.length - 1]) {
      setPageNum(newPageNum);
    }
  };

  const [searchName, setSearchName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Latest");
  const [category, setCategory] = useState<string>("All Transactions");

  const filteredTx: Transaction[] = filterAndSortTransactions(
    transactions,
    searchName,
    category,
    sortBy
  );

  const i = pageNum * 10;
  const selectedTnxs = filteredTx.slice(i - 10, i);

  // Modal management hooks
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

  const recurringOptions = recurringBills.map((bill: RecurringBill) => {
    return {
      value: `${bill.id}`,
      label: `${bill.name} - $${Math.abs(bill.amount)}`,
      dueDate: bill.dueDate,
      category: bill.category,
      name: bill.name,
      amount: formatDecimalNumber(Math.abs(bill.amount)),
    };
  });

  const [selectedTnx, setSelectedTnx] = useState<Transaction | null>(null);

  // handle transaction delete functionality
  const handleDeleteTnx = () => {
    if (selectedTnx === null) return;

    // Remove the deleted transaction from the list.
    const newTnxs = transactions.filter(
      (tnx: Transaction) => tnx.id !== selectedTnx.id
    );

    const amount = selectedTnx.amount;
    const isNegative = amount < 0;
    setBalance({
      ...balance,
      current: isNegative ? balance.current + amount : balance.current - amount,
      income: isNegative ? balance.income : balance.income - amount,
      expenses: isNegative ? balance.expenses + amount : balance.expenses,
    });

    setTransactions(newTnxs);

    // If the deleted transaction was recurring, update the recurring bill.
    if (selectedTnx.recurring && selectedTnx.recurringId) {
      // Use the updated transactions list for related transactions.
      const relatedTxns = newTnxs.filter(
        (txn) => txn.recurring && txn.recurringId === selectedTnx.recurringId
      );

      let updatedRecurringBills;
      if (relatedTxns.length === 0) {
        // If no related transactions remain, clear the lastPaid date.
        updatedRecurringBills = recurringBills.map((bill) => {
          if (bill.id === selectedTnx.recurringId) {
            return { ...bill, lastPaid: "" };
          }
          return bill;
        });
      } else {
        // Find the transaction with the latest date.
        const latestTxn = relatedTxns.reduce((prev, current) =>
          new Date(current.date) > new Date(prev.date) ? current : prev
        );
        updatedRecurringBills = recurringBills.map((bill) => {
          if (bill.id === selectedTnx.recurringId) {
            return { ...bill, lastPaid: latestTxn.date };
          }
          return bill;
        });
      }
      setRecurringBills(updatedRecurringBills);
    }
  };

  // function to add a transaction.
  const handleAddTransaction = (formData: FormValues) => {
    let transaction: Transaction;
    if (formData.paymentType === "oneTime") {
      // For one-time, use the entered payment direction.
      transaction = {
        id: uuidv4(),
        name: formData.txnName,
        category: formData.category,
        date: new Date().toISOString(), // stored in ISO format
        amount:
          formData.paymentDirection === "paid"
            ? -parseFloat(formData.amount)
            : parseFloat(formData.amount),
        recurring: false,
        theme: "#defaultTheme",
      };
    } else {
      // For recurring transactions, force paymentDirection to "paid"
      let recurringId = formData.recurringId;
      if (!recurringId || recurringId === "new") {
        // Create new recurring bill if none exists or "new" was chosen.
        const newBill: RecurringBill = {
          id: uuidv4(),
          name: formData.txnName,
          category: formData.category,
          amount: -parseFloat(formData.amount),
          recurring: true,
          lastPaid: new Date().toISOString(),
          dueDate: formData.dueDate!, // dueDate is required in recurring mode
          theme: "#defaultRecurringTheme",
        };
        // Update recurring bills state: assume setRecurringBills adds the new bill.
        setRecurringBills((prevBills: RecurringBill[]) => [
          ...prevBills,
          newBill,
        ]);
        recurringId = newBill.id;
      }
      transaction = {
        id: uuidv4(),
        name: formData.txnName,
        category: formData.category,
        date: new Date().toISOString(),
        // Force amount to be negative for recurring payments (bills)
        amount: -parseFloat(formData.amount),
        recurring: true,
        recurringId,
        theme: "#defaultRecurringTheme",
      };
    }
    // Update transactions state (prepend to the list)
    setTransactions((prevTxns: Transaction[]) => [transaction, ...prevTxns]);
  };

  return (
    <>
      <SetTitle title="Transactions" />
      <Box ref={containerRef}>
        <PageDiv>
          <Stack direction="column" gap="32px">
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="100%"
                height="56px"
                fontSize="32px"
                fontWeight="bold"
                color={theme.palette.primary.main}
              >
                Transactions
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
                  + Add New Transaction
                </Typography>
              </Button>
            </Stack>
            <SubContainer>
              <Filter
                parentWidth={parentWidth}
                searchName={searchName}
                setSearchName={setSearchName}
                category={category}
                setCategory={setCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              <TransactionsTable
                txns={selectedTnxs}
                parentWidth={parentWidth}
                setDeleteModalOpen={(txn: Transaction) => {
                  setSelectedTnx(txn);
                  openDeleteModal();
                }}
                setEditModalOpen={(txn: Transaction) => {
                  setSelectedTnx(txn);
                  openEditModal();
                }}
              />

              <PageNav
                numbers={numbers}
                selectedPage={pageNum}
                handlePageSelect={handlePageChange}
                parentWidth={parentWidth}
              />
            </SubContainer>
          </Stack>
        </PageDiv>

        {selectedTnx && isDeleteModalOpen && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => {
              setSelectedTnx(null);
              closeDeleteModal();
            }}
            handleDelete={() => handleDeleteTnx()}
            label="Transaction"
            type="transaction"
          />
        )}

        {isAddModalOpen && (
          <AddEditTransactionModal
            open={isAddModalOpen}
            onClose={closeAddModal}
            onSubmit={(formData: FormValues) => {
              handleAddTransaction(formData);
              closeAddModal();
            }}
            recurringOptions={recurringOptions}
          />
        )}

        {selectedTnx && isEditModalOpen && (
          <AddEditTransactionModal
            open={isEditModalOpen}
            onClose={() => {
              setSelectedTnx(null);
              closeEditModal();
            }}
            onSubmit={() => console.log("Edit Transaction")}
            recurringOptions={recurringOptions}
            txnData={{
              txnName: selectedTnx.name,
              category: selectedTnx.category,
              date: formatISODateToDDMMYYYY(selectedTnx.date),
              amount: formatDecimalNumber(
                Math.abs(selectedTnx.amount)
              ).toString(),
              paymentDirection: selectedTnx.amount < 0 ? "paid" : "received",
              paymentType: selectedTnx.recurring ? "recurring" : "oneTime",
              recurringId: selectedTnx.recurringId || "",
            }}
          />
        )}
      </Box>
    </>
  );
};

export default TransactionsPage;
