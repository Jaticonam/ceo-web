import { useEffect, useState } from "react";

import { USERS } from "../constants/users";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { SEED_TRANSACTIONS } from "../data/seedTransactions";
import { calculateBalances } from "../utils/finance";

const STORAGE_KEYS = {
  user: "ceo_user_v4",
  transactions: "ceo_transactions_v4",
  settings: "ceo_settings_v4",
};

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function useTransactionsStore() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.user) || USERS[0];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.transactions);

    return safeJsonParse(saved, SEED_TRANSACTIONS);
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.settings);

    return safeJsonParse(saved, DEFAULT_SETTINGS);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.user, currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify(settings)
    );
  }, [settings]);

  const addTransaction = (transactionData) => {
    const amount =
      transactionData.type === "transferencia"
        ? Number(transactionData.amount || 0)
        : transactionData.splits.reduce(
            (sum, split) => sum + Number(split.amount || 0),
            0
          );

    const newTransaction = {
      ...transactionData,
      amount,
      createdBy: currentUser,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
    };

    setTransactions((current) =>
      [newTransaction, ...current].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  };

  const updateTransaction = (id, updatedData) => {
    const amount =
      updatedData.type === "transferencia"
        ? Number(updatedData.amount || 0)
        : updatedData.splits.reduce(
            (sum, split) => sum + Number(split.amount || 0),
            0
          );

    setTransactions((current) =>
      current
        .map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...updatedData,
                amount,
              }
            : transaction
        )
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  const getBalances = (transactionsToCalculate = transactions) => {
    return calculateBalances(transactionsToCalculate, settings);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    currentUser,
    setCurrentUser,

    settings,
    setSettings,

    getBalances,
  };
}