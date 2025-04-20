import { Box, Stack, Typography, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import SetTitle from "../ui/SetTitle";
import PageDiv from "../ui/PageDiv";
import SubContainer from "../ui/SubContainer";
import TransactionsTable from "./components/TransactionsTable";
import PageNav from "./components/PageNav";
import { useContext, useMemo, useState } from "react";
import {
  BalanceTransactionsActionContext,
  BalanceTransactionsDataContext,
} from "../context/BalanceTransactionsContext";
import { RecurringBill, Transaction } from "../types/Data";
import useParentWidth from "../customHooks/useParentWidth";
import Button from "../ui/Button";
import useModal from "../customHooks/useModal";
import DeleteModal from "../ui/DeleteModal";
import {
  RecurringActionContext,
  RecurringDataContext,
} from "../context/RecurringContext";
import AddEditTransactionModal from "./components/AddEditTransactionModal";
import {
  convertDateToISOString,
  formatDecimalNumber,
  formatISODateToDDMMYYYY,
  getRandomColor,
} from "../utils/utilityFunctions";
import { SettingsContext } from "../context/SettingsContext";
import EmptyStatePage from "../ui/EmptyStatePage";
import Filter from "../ui/Filter";

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

// Helper function: generate month options from earliest transaction date until current month
const getMonthYearOptions = (transactions: Transaction[]): string[] => {
  if (transactions.length === 0) return [];
  // Find the earliest transaction date
  const dates = transactions.map((txn) => new Date(txn.date));
  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
  const current = new Date();
  const options = [];
  const iterDate = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (
    iterDate.getFullYear() < current.getFullYear() ||
    (iterDate.getFullYear() === current.getFullYear() &&
      iterDate.getMonth() <= current.getMonth())
  ) {
    options.push(
      iterDate.toLocaleString("default", { month: "long", year: "numeric" })
    );
    iterDate.setMonth(iterDate.getMonth() + 1);
  }
  return options.reverse();
};

// Helper function : filter transaction as per search, sort by , category and month
const filterAndSortTransactions = (
  transactions: Transaction[],
  searchName: string,
  category: string,
  sortBy: string,
  selectedMonth: string
): Transaction[] => {
  const filteredTx = transactions.filter((txn) => {
    const matchesSearch = searchName
      ? txn.name.toLowerCase().includes(searchName.toLowerCase().trim())
      : true;
    const matchesCategory =
      category === "All Transactions" || txn.category === category;
    let matchesMonth = true;
    if (selectedMonth && selectedMonth !== "All") {
      const txnDate = new Date(txn.date);
      const txnMonthYear = txnDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      matchesMonth = txnMonthYear === selectedMonth;
    }
    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Sorting Logic
  return filteredTx.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    switch (sortBy) {
      case "Latest": {
        // Primary sort: descending by date (so b - a)
        const dateDiff = dateB - dateA;
        if (dateDiff !== 0) {
          return dateDiff;
        }
        // If dates tie, fallback to name A–Z
        return a.name.localeCompare(b.name);
      }

      case "Oldest": {
        // Primary sort: ascending by date (so a - b)
        const dateDiff = dateA - dateB;
        if (dateDiff !== 0) {
          return dateDiff;
        }
        // If dates tie, fallback to name A–Z
        return a.name.localeCompare(b.name);
      }

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
  const theme = useTheme();
  const { containerRef, parentWidth } = useParentWidth();

  const [pageNum, setPageNum] = useState<number>(() => 1);

  const { transactions, balance } = useContext(BalanceTransactionsDataContext);
  const { setTransactions, setBalance } = useContext(
    BalanceTransactionsActionContext
  );

  const recurringBills = useContext(RecurringDataContext).recurringBills;
  const { setRecurringBills } = useContext(RecurringActionContext);
  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  const [searchName, setSearchName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Latest");
  const [category, setCategory] = useState<string>("All Transactions");

  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const filteredTx: Transaction[] = filterAndSortTransactions(
    transactions,
    searchName,
    category,
    sortBy,
    selectedMonth
  );

  const numPages = Math.ceil(filteredTx.length / 10);

  const numbers = Array.from({ length: numPages }, (_, i) => i + 1);

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum >= 1 && newPageNum <= numbers[numbers.length - 1]) {
      setPageNum(newPageNum);
    }
  };

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
      label: `${bill.name} - ${currencySymbol}${Math.abs(bill.amount)}`,
      dueDate: bill.dueDate,
      category: bill.category,
      name: bill.name,
      amount: formatDecimalNumber(Math.abs(bill.amount)),
    };
  });

  const [selectedTnx, setSelectedTnx] = useState<Transaction | null>(null);

  // Handle transaction delete functionality
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

  // Function to add a transaction.
  const handleAddTransaction = (formData: FormValues) => {
    let transaction: Transaction;
    let billTheme = getRandomColor();
    const isoDate = convertDateToISOString(formData.date);

    if (formData.paymentType === "oneTime") {
      transaction = {
        id: uuidv4(),
        name: formData.txnName,
        category: formData.category,
        date: isoDate,
        amount:
          formData.paymentDirection === "paid"
            ? -parseFloat(formData.amount)
            : parseFloat(formData.amount),
        recurring: false,
        theme: billTheme,
      };
    } else {
      // Recurring transaction logic (similar to what you already have)
      let recurringId = formData.recurringId;
      if (!recurringId || recurringId === "new") {
        const newBill: RecurringBill = {
          id: uuidv4(),
          name: formData.txnName,
          category: formData.category,
          amount: -parseFloat(formData.amount),
          recurring: true,
          lastPaid: isoDate,
          dueDate: formData.dueDate!,
          theme: billTheme,
        };
        setRecurringBills((prevBills: RecurringBill[]) => [
          ...prevBills,
          newBill,
        ]);
        recurringId = newBill.id;
        billTheme = newBill.theme;
      } else if (recurringId) {
        const updatedBills: RecurringBill[] = recurringBills.map((bill) => {
          if (bill.id === recurringId) {
            billTheme = bill.theme;
            return { ...bill, lastPaid: isoDate };
          }
          return bill;
        });
        setRecurringBills([...updatedBills]);
      }
      transaction = {
        id: uuidv4(),
        name: formData.txnName,
        category: formData.category,
        date: isoDate,
        amount: -parseFloat(formData.amount), // force negative for recurring
        recurring: true,
        recurringId,
        theme: billTheme,
      };
    }

    // Update transactions state
    setTransactions((prevTxns: Transaction[]) => [transaction, ...prevTxns]);

    // Update balance state based on transaction amount
    if (transaction.amount < 0) {
      // "Paid" transaction: subtract from current balance and add to expenses
      setBalance({
        ...balance,
        current: balance.current + transaction.amount, // transaction.amount is negative
        expenses: balance.expenses + Math.abs(transaction.amount),
      });
    } else {
      // "Received" transaction: add to current balance and income
      setBalance({
        ...balance,
        current: balance.current + transaction.amount,
        income: balance.income + transaction.amount,
      });
    }
  };

  // Function to edit a transaction.
  const handleEditTransaction = (formData: FormValues) => {
    if (!selectedTnx) return; // safety check

    const isoDate = convertDateToISOString(formData.date);
    // Determine new amount based on the updated form data
    const newAmount =
      formData.paymentType === "oneTime"
        ? formData.paymentDirection === "paid"
          ? -parseFloat(formData.amount)
          : parseFloat(formData.amount)
        : -parseFloat(formData.amount); // recurring is forced negative

    // Calculate the difference from the original amount
    const diff = newAmount - selectedTnx.amount;

    // Update the transactions list
    setTransactions((prevTxns: Transaction[]) =>
      prevTxns.map((txn) => {
        if (txn.id !== selectedTnx.id) return txn;
        if (formData.paymentType === "oneTime") {
          return {
            ...txn,
            name: formData.txnName,
            category: formData.category,
            date: isoDate,
            amount: newAmount,
            recurring: false,
            recurringId: undefined,
            theme: txn.theme || getRandomColor(),
          };
        } else {
          let recurringId = formData.recurringId;
          let billTheme = getRandomColor();

          if (selectedTnx.recurring) {
            // If already recurring, update only the date.
            return {
              ...txn,
              date: isoDate,
            };
          } else {
            // Switching from one-time to recurring:
            if (!recurringId || recurringId === "new") {
              const newBill: RecurringBill = {
                id: uuidv4(),
                name: formData.txnName,
                category: formData.category,
                amount: -parseFloat(formData.amount),
                recurring: true,
                lastPaid: isoDate,
                dueDate: formData.dueDate!,
                theme: getRandomColor(),
              };
              setRecurringBills((prevBills: RecurringBill[]) => [
                ...prevBills,
                newBill,
              ]);
              recurringId = newBill.id;
              billTheme = newBill.theme;
            } else if (recurringId) {
              const updatedBills: RecurringBill[] = recurringBills.map(
                (bill) => {
                  if (bill.id === recurringId) {
                    billTheme = bill.theme;
                    return { ...bill, lastPaid: isoDate };
                  }
                  return bill;
                }
              );
              setRecurringBills([...updatedBills]);
            }
            return {
              ...txn,
              name: formData.txnName,
              category: formData.category,
              date: isoDate,
              amount: newAmount,
              recurring: true,
              recurringId,
              theme: billTheme,
            };
          }
        }
      })
    );

    // Update balance state using the difference between new and old amounts
    if (diff < 0) {
      // More money paid than before, subtract the difference
      setBalance({
        ...balance,
        current: balance.current + diff, // diff is negative
        expenses: balance.expenses + Math.abs(diff),
      });
    } else {
      // More money received than before, add the difference
      setBalance({
        ...balance,
        current: balance.current + diff,
        income: balance.income + diff,
      });
    }
  };

  const monthOptions = useMemo(
    () => getMonthYearOptions(transactions),
    [transactions]
  );

  {
    /* Empty Page for no transactions */
  }
  if (filteredTx.length === 0) {
    return (
      <>
        <EmptyStatePage
          message="No Transactions Yet"
          subText="Add your first transaction..."
          buttonLabel="Add Transaction"
          onButtonClick={() => openAddModal()}
        />
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
      </>
    );
  }

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
                  {parentWidth < 450 ? "+" : "+ Add New Transaction"}
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
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                monthOptions={monthOptions}
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
            onSubmit={(formData: FormValues) => {
              handleEditTransaction(formData);
              closeEditModal();
            }}
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
