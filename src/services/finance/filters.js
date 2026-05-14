import { isSameMonth } from "../../utils/date";

export function filterTransactionsByMonth({
  transactions,
  selectedMonth,
}) {
  return transactions.filter((transaction) =>
    isSameMonth(
      new Date(transaction.createdAt),
      selectedMonth
    )
  );
}