import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ceo_transactions";

const initialTransactions = [
  {
    id: crypto.randomUUID(),
    type: "income",
    brand: "Wooly",
    category: "Venta",
    amount: 2840,
    method: "Yape",
    note: "Ventas iniciales",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    type: "expense",
    brand: "Gleemour",
    category: "Publicidad",
    amount: 980,
    method: "BCP",
    note: "Campaña Meta Ads",
    createdAt: new Date().toISOString(),
  },
];

export function useTransactionsStore() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    return initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...transaction,
      amount: Number(transaction.amount || 0),
    };

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);
  };

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      income,
      expenses,
      cash: income - expenses,
    };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    summary,
  };
}