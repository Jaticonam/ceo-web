export function buildExpenseChartData(monthTransactions) {
  const totals = {};

  monthTransactions
    .filter((transaction) => transaction.type === "gasto")
    .forEach((transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] || 0) +
        Number(transaction.amount || 0);
    });

  return Object.entries(totals).map(([name, value]) => ({
    name,
    value,
  }));
}

export function buildMonthlyTrendData(transactions) {
  const months = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);

    const key = date.toLocaleDateString("es-PE", {
      month: "short",
      year: "2-digit",
    });

    if (!months[key]) {
      months[key] = {
        month: key,
        income: 0,
        expense: 0,
      };
    }

    if (transaction.type === "ingreso") {
      months[key].income += Number(transaction.amount || 0);
    }

    if (transaction.type === "gasto") {
      months[key].expense += Number(transaction.amount || 0);
    }
  });

  return Object.values(months);
}