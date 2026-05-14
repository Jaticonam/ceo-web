import { useEffect, useState } from "react";

import { USERS } from "../constants/users";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { SEED_DATA } from "../data/seedData";

import { calculateBalances } from "../services/finance/balances";

import {
  createTransaction,
  updateTransactionById,
} from "../services/finance/transactions";

export default function useTransactionsStore() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("ceo_user_v4") || USERS[0];
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ceo_transactions_v4"
      );

      return saved
        ? JSON.parse(saved)
        : SEED_DATA;
    } catch {
      return SEED_DATA;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ceo_settings_v4"
      );

      return saved
        ? JSON.parse(saved)
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ceo_transactions_v4",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "ceo_user_v4",
      currentUser
    );
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(
      "ceo_settings_v4",
      JSON.stringify(settings)
    );
  }, [settings]);

  const addTransaction = (transactionData) => {
    const newTransaction = createTransaction({
      transactionData,
      currentUser,
    });

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);
  };

  const updateTransaction = (
    id,
    updatedData
  ) => {
    setTransactions((current) =>
      updateTransactionById({
        transactions: current,
        id,
        updatedData,
      })
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter(
        (transaction) =>
          transaction.id !== id
      )
    );
  };

  const getBalances = (
    transactionsToCalculate = transactions
  ) => {
    return calculateBalances({
      transactions: transactionsToCalculate,
      settings,
    });
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentUser,
    setCurrentUser,
    getBalances,
    settings,
    setSettings,
  };
}