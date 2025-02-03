import axios from "axios";
import { useEffect, useState } from "react";
import { DataType } from "../types/Data";
import BalanceTransactionsProvider from "./BalanceTransactionsProvider";
import BudgetsProvider from "./BudgetsProvider";
import RecurringProvider from "./RecurringProvider";
import { PotsProvider } from "./PotsProvider";

interface DataProviderProps {
  children: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataType>(() => ({
    balance: {
      current: 0,
      income: 0,
      expenses: 0,
    },
    transactions: [],
    budgets: [],
    pots: [],
    recurringBills: [],
  }));

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to cancel the request if the component unmounts
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get("/data.json", {
          // pass the signal to axios
          signal: controller.signal,
        });
        console.log("Data received : ", response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        // Only log the error if it's not an axios cancel
        if (!axios.isCancel(error)) {
          console.error("Error fetching data:", error);
          setError("Failed to load data");
        }
      }
    };

    fetchData();

    // Cleanup: abort the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, []);

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

  if (loading)
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
        Loading...
      </div>
    );

  return (
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
  );
};

export default DataProvider;
