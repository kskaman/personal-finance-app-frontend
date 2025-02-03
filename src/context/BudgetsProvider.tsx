import { ReactNode, useState, useMemo } from "react";
import { Budget } from "../types/Data";
import { BudgetsActionContext, BudgetsDataContext } from "./BudgetsContext";

interface Props {
  children: ReactNode;
  budgets: Budget[];
}

function computeTotal(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.maximum, 0);
}

const BudgetsProvider = ({ children, budgets }: Props) => {
  const [budgetsState, setBudgetsState] = useState<Budget[]>(() => budgets);

  const budgetsTotal = useMemo(() => {
    return computeTotal(budgetsState);
  }, [budgetsState]);

  return (
    <BudgetsDataContext.Provider
      value={{ budgets: budgetsState, budgetsTotal: budgetsTotal }}
    >
      <BudgetsActionContext.Provider value={{ setBudgets: setBudgetsState }}>
        {children}
      </BudgetsActionContext.Provider>
    </BudgetsDataContext.Provider>
  );
};

export default BudgetsProvider;
