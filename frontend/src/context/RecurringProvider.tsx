import { ReactNode, useMemo, useState } from "react";
import { RecurringBill, RecurringSummary } from "../types/Data";
import {
  RecurringActionContext,
  RecurringDataContext,
} from "./RecurringContext";

interface Props {
  children: ReactNode;
  recurringBills: RecurringBill[];
}

function computeRecurringSummary(bills: RecurringBill[]): RecurringSummary {
  let paidCount = 0;
  let paidTotal = 0;
  let unpaidCount = 0;
  let unpaidTotal = 0;
  let dueSoonCount = 0;
  let dueSoonTotal = 0;
  let dueCount = 0;
  let dueTotal = 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const DUE_SOON_THRESHOLD_DAYS = 3;

  bills.forEach((bill) => {
    const { amount, lastPaid, dueDate } = bill;
    const numericAmount = Math.abs(amount);

    // Parse Dates
    const lastPaidDate = lastPaid ? new Date(lastPaid) : null;
    const dueDateObj =
      dueDate && !isNaN(Number(dueDate))
        ? new Date(now.getFullYear(), now.getMonth(), Number(dueDate))
        : null;

    // 1) Determine if bills is "paid" for this cycle
    const isPaid = lastPaidDate && lastPaidDate >= startOfMonth;

    // 2) If not paid, is it "due soon"?
    const diffDays =
      dueDateObj && (dueDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24);
    const isDueSoon =
      dueDateObj &&
      !isPaid &&
      diffDays &&
      diffDays > 0 &&
      diffDays <= DUE_SOON_THRESHOLD_DAYS;

    const isDue = dueDateObj && !isPaid && diffDays && diffDays <= 0;

    if (isPaid) {
      paidCount++;
      paidTotal += numericAmount;
    } else if (isDueSoon) {
      dueSoonCount++;
      dueSoonTotal += numericAmount;
    } else if (isDue) {
      dueCount++;
      dueTotal += numericAmount;
    } else {
      unpaidCount++;
      unpaidTotal += numericAmount;
    }
  });

  return {
    due: { count: dueCount, total: dueTotal },
    paid: { count: paidCount, total: paidTotal },
    unpaid: { count: unpaidCount, total: unpaidTotal },
    dueSoon: { count: dueSoonCount, total: dueSoonTotal },
  };
}

const RecurringProvider = ({ children, recurringBills }: Props) => {
  const [recurringState, setRecurringState] = useState<RecurringBill[]>(
    () => recurringBills
  );

  const recurringSummary = useMemo<RecurringSummary>(() => {
    return computeRecurringSummary(recurringState);
  }, [recurringState]);

  return (
    <RecurringDataContext.Provider
      value={{
        recurringBills: recurringState,
        recurringSummary: recurringSummary,
      }}
    >
      <RecurringActionContext.Provider
        value={{ setRecurringBills: setRecurringState }}
      >
        {children}
      </RecurringActionContext.Provider>
    </RecurringDataContext.Provider>
  );
};

export default RecurringProvider;
