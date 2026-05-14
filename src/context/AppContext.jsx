import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import useTransactionsStore from "../hooks/useTransactionsStore";
import useAnalytics from "../hooks/useAnalytics";

import { filterTransactionsByMonth } from "../services/finance/filters";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const store = useTransactionsStore();

  const { transactions, getBalances } = store;

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthTransactions = useMemo(() => {
    return filterTransactionsByMonth({
      transactions,
      selectedMonth,
    });
  }, [transactions, selectedMonth]);

  const { global, byBrand } = getBalances();
  const { global: monthlySummary } = getBalances(monthTransactions);

  const analytics = useAnalytics({
    transactions,
    monthTransactions,
  });

  const value = {
    ...store,

    selectedMonth,
    setSelectedMonth,

    monthTransactions,

    global,
    byBrand,
    monthlySummary,

    ...analytics,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext debe usarse dentro de <AppProvider>."
    );
  }

  return context;
}