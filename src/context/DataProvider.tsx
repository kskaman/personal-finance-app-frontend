import axios from "axios";
import { useEffect, useState } from "react";
import { DataType } from "../types/Data";
import BalanceTransactionsProvider from "./BalanceTransactionsProvider";
import BudgetsProvider from "./BudgetsProvider";
import RecurringProvider from "./RecurringProvider";
import { PotsProvider } from "./PotsProvider";
import CategoryMarkerProvider from "./CategoryMarkerProvider";

interface DataProviderProps {
  children: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataType | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve the user token (which is the user's UUID) from localStorage
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    // Create an AbortController to cancel the request if the component unmounts
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get("/data.json", {
          signal: controller.signal,
        });

        const allData: DataType[] = response.data.data;
        const userData = allData.find((d) => d.userId === userToken);
        if (userData) {
          setData(userData);
        } else {
          setError("No data found for the current user.");
        }
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching data:", err);
          setError("Failed to load data");
        }
      }
    };

    fetchData();

    // Cleanup: abort the request if the component unmounts
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

  if (!data) {
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
        Error: No data available.
      </div>
    );
  }

  return (
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
  );
};

export default DataProvider;
