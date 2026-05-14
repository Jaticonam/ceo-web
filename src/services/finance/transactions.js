export function calculateTransactionAmount(transactionData) {
  if (transactionData.type === "transferencia") {
    return parseFloat(transactionData.amount) || 0;
  }

  return transactionData.splits.reduce(
    (sum, split) => sum + (parseFloat(split.amount) || 0),
    0
  );
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function createTransaction({
  transactionData,
  currentUser,
}) {
  const amount = calculateTransactionAmount(transactionData);

  return {
    ...transactionData,
    amount,
    createdBy: currentUser,
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(),
  };
}

export function updateTransactionById({
  transactions,
  id,
  updatedData,
}) {
  const amount = calculateTransactionAmount(updatedData);

  return sortTransactionsByDate(
    transactions.map((transaction) =>
      transaction.id === id
        ? {
            ...transaction,
            ...updatedData,
            amount,
          }
        : transaction
    )
  );
}