import { createContext } from "react";
import { RecurringBill, RecurringSummary } from "../types/Data";

interface RecurringDataContextProps {
  recurringBills: RecurringBill[];
  recurringSummary: RecurringSummary;
}

export const RecurringDataContext = createContext<RecurringDataContextProps>({
  recurringBills: [],
  recurringSummary: {
    due: { count: 0, total: 0 },
    paid: { count: 0, total: 0 },
    unpaid: { count: 0, total: 0 },
    dueSoon: { count: 0, total: 0 },
  },
});

interface RecurringActionContextProps {
  setRecurringBills: React.Dispatch<React.SetStateAction<RecurringBill[]>>;
}

export const RecurringActionContext =
  createContext<RecurringActionContextProps>({
    setRecurringBills: () => {},
  });
