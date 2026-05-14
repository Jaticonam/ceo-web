import { useMemo } from "react";

import {
  buildExpenseChartData,
  buildMonthlyTrendData,
} from "../services/finance/analytics";

export default function useAnalytics({
  transactions,
  monthTransactions,
}) {
  const expenseChartData = useMemo(() => {
    return buildExpenseChartData(monthTransactions);
  }, [monthTransactions]);

  const monthlyTrendData = useMemo(() => {
    return buildMonthlyTrendData(transactions);
  }, [transactions]);

  return {
    expenseChartData,
    monthlyTrendData,
  };
}