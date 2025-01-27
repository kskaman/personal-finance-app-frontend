import axios from "axios";
import { useEffect, useState } from "react";
import { DataType } from "../types/Data";

import { DataContext, DataActionsContext } from "./DataContexts";

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
  }));

  useEffect(() => {
    // Create an AbortController to cancel the request if the component unmounts
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get("/data.json", {
          // pass the signal to axios
          signal: controller.signal,
        });
        setData(response.data);
      } catch (error) {
        // Only log the error if it's not an axios cancel
        if (!axios.isCancel(error)) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    // Cleanup: abort the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <DataContext.Provider value={data}>
      <DataActionsContext.Provider value={setData}>
        {children}
      </DataActionsContext.Provider>
    </DataContext.Provider>
  );
};

export default DataProvider;
