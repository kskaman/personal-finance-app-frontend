import { createContext } from "react";
import { Budget } from "../types/Data";

interface BudgetsDataContextProps {
  budgets: Budget[];
  budgetsTotal: number;
}

export const BudgetsDataContext = createContext<BudgetsDataContextProps>({
  budgets: [],
  budgetsTotal: 0,
});

interface BudgetsActionContextProps {
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

export const BudgetsActionContext = createContext<BudgetsActionContextProps>({
  setBudgets: () => {},
});
