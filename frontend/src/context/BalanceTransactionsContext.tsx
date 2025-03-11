import { createContext } from "react";
import { Balance, Transaction } from "../types/Data";

export interface BalanceTransactionsDataContextProps {
    balance: Balance;   
    transactions: Transaction[];
    monthlySpentByCategory: Record<string, number>;
}

export const BalanceTransactionsDataContext = createContext<BalanceTransactionsDataContextProps>({
    balance: { current: 0, income: 0, expenses: 0 },
    transactions: [],
    monthlySpentByCategory: {},
})

export interface BalanceTransactionActionsContextProps {
    addTransaction: (newTx: Transaction) => void; 
    setBalance: React.Dispatch<React.SetStateAction<Balance>>
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

export const BalanceTransactionsActionContext = createContext<BalanceTransactionActionsContextProps>({
    addTransaction: () => {},
    setBalance: () => {},
    setTransactions: () => {},
});
