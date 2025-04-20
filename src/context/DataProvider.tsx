import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { DataType } from "../types/Data";
import BalanceTransactionsProvider from "./BalanceTransactionsProvider";
import BudgetsProvider from "./BudgetsProvider";
import RecurringProvider from "./RecurringProvider";
import { PotsProvider } from "./PotsProvider";
import CategoryMarkerProvider from "./CategoryMarkerProvider";
import { SettingsProvider } from "./SettingsProvider";
import { AuthContext } from "./AuthProvider";
import LoadingIndicator from "../ui/LoadingIndicator";

/**
 * Helper function to update rendered data
 * shiftDatesIfNeeded:
 *   - Finds the latest transaction date
 *   - If the current date is beyond that,
 *     calculates how many months to shift,
 *     then updates each transaction and
 *     each recurring bill's lastPaid.
 */
function shiftDatesIfNeeded(data: DataType): DataType {
  // Make a shallow clone if you want to avoid mutating the original:
  const updatedData = { ...data };

  // 1) Find the last transaction’s date
  const allDates = updatedData.transactions.map((tx) => new Date(tx.date));
  const lastTxDate = allDates.reduce(
    (latest, current) => (current > latest ? current : latest),
    new Date(0)
  );

  // 2) Compare to the current date
  const now = new Date();

  // 3) If now is after lastTxDate, figure out how many months to shift forward
  if (now > lastTxDate) {
    const monthsDiff =
      (now.getFullYear() - lastTxDate.getFullYear()) * 12 +
      (now.getMonth() - lastTxDate.getMonth());

    // Only shift if there's at least 1 month difference
    if (monthsDiff > 0) {
      // Shift all transactions
      updatedData.transactions = updatedData.transactions.map((tx) => {
        const oldDate = new Date(tx.date);
        oldDate.setMonth(oldDate.getMonth() + monthsDiff);
        return {
          ...tx,
          date: oldDate.toISOString(),
        };
      });

      // Shift all recurringBills lastPaid
      updatedData.recurringBills = updatedData.recurringBills.map((rb) => {
        const oldDate = new Date(rb.lastPaid);
        oldDate.setMonth(oldDate.getMonth() + monthsDiff);
        return {
          ...rb,
          lastPaid: oldDate.toISOString(),
        };
      });
    }
  }

  return updatedData;
}

// Interface and main component
interface DataProviderProps {
  children: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataType | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userToken = useContext(AuthContext).user?.id;

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get("/data.json", {
          signal: controller.signal,
        });
        // Assuming data.json has a property "data" which is an array of DataType objects.
        const allData: DataType[] = response.data.data;
        const userData = allData.find((d) => d.userId === userToken);
        if (userData) {
          const shiftedData = shiftDatesIfNeeded(userData);
          setData(shiftedData);
        } else {
          setError("No data found for the current user.");
        }
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching data:", err);
          setError("Failed to load data");
        }
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: abort the request if the component unmounts.
    return () => {
      controller.abort();
    };
  }, [userToken]);

  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        Error: {error}
      </div>
    );

  if (loading) return <LoadingIndicator />;

  if (!data) {
    return <LoadingIndicator />;
  }

  return (
    <SettingsProvider
      font={data.settings.font}
      currency={data.settings.currency}
      displayedModules={data.settings.displayedModules}
    >
      <CategoryMarkerProvider
        categories={data.categories}
        markerThemes={data.markerThemes}
      >
        <BalanceTransactionsProvider
          balance={data.balance}
          transactions={data.transactions}
        >
          <BudgetsProvider budgets={data.budgets}>
            <RecurringProvider recurringBills={data.recurringBills}>
              <PotsProvider pots={data.pots}>{children}</PotsProvider>
            </RecurringProvider>
          </BudgetsProvider>
        </BalanceTransactionsProvider>
      </CategoryMarkerProvider>
    </SettingsProvider>
  );
};

export default DataProvider;
