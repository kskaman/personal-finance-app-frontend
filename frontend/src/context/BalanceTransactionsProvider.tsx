import { useState, useMemo, ReactNode } from "react";

import {
  BalanceTransactionsDataContext,
  BalanceTransactionsActionContext,
} from "./BalanceTransactionsContext.tsx";
import { Balance, Transaction } from "../types/Data";

interface Props {
  children: ReactNode;
  balance: Balance;
  transactions: Transaction[];
}

const BalanceTransactionsProvider = ({
  children,
  balance,
  transactions,
}: Props) => {
  const [balanceState, setBalanceState] = useState<Balance>(balance);
  const [transactionsState, setTransactionsState] =
    useState<Transaction[]>(transactions);

  const addTransaction = (newTx: Transaction) => {
    // function to add new transaction
    setTransactionsState((prev) => [...prev, newTx]);

    // Update balance
    setBalanceState((prev) => {
      const newCurrent = prev.current + newTx.amount;
      const newIncome =
        newTx.amount >= 0 ? prev.income + newTx.amount : prev.income;
      const newExpenses =
        newTx.amount < 0 ? prev.expenses - newTx.amount : prev.expenses;

      return {
        current: newCurrent,
        income: newIncome,
        expenses: newExpenses,
      };
    });
  };

  const monthlySpentByCategory: Record<string, number> = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = transactionsState.filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return filtered.reduce((acc, tx) => {
      if (tx.amount < 0) {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      }
      return acc;
    }, {} as Record<string, number>);
  }, [transactionsState]);

  const dataValue = {
    balance: balanceState,
    transactions: transactionsState,
    monthlySpentByCategory,
  };

  const actionsValue = {
    addTransaction,
    setBalance: setBalanceState,
    setTransactions: setTransactionsState,
  };

  return (
    <BalanceTransactionsDataContext.Provider value={dataValue}>
      <BalanceTransactionsActionContext.Provider value={actionsValue}>
        {children}
      </BalanceTransactionsActionContext.Provider>
    </BalanceTransactionsDataContext.Provider>
  );
};

export default BalanceTransactionsProvider;
