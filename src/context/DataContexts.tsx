import { createContext } from "react";
import { DataType } from "../types/Data";

export const DataContext = createContext<DataType>({
  balance: {
    current: 0,
    income: 0,
    expenses: 0,
  },
  transactions: [],
  budgets: [],
  pots: [],
});

export const DataActionsContext = createContext<
  React.Dispatch<React.SetStateAction<DataType>>
>(() => {});
