import usePersistentState from "./usePersistentState";

import { USERS } from "../constants/users";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { SEED_DATA } from "../data/seedData";

import { calculateBalances } from "../services/finance/balances";

import {
  createTransaction,
  updateTransactionById,
} from "../services/finance/transactions";

export default function useTransactionsStore() {
  const [currentUser, setCurrentUser] = usePersistentState(
    "ceo_user_v4",
    USERS[0]
  );

  const [transactions, setTransactions] = usePersistentState(
    "ceo_transactions_v4",
    SEED_DATA
  );

  const [settings, setSettings] = usePersistentState(
    "ceo_settings_v4",
    DEFAULT_SETTINGS
  );

  const addTransaction = (transactionData) => {
    const newTransaction = createTransaction({
      transactionData,
      currentUser,
    });

    setTransactions((current) => [newTransaction, ...current]);
  };

  const updateTransaction = (id, updatedData) => {
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
      current.filter((transaction) => transaction.id !== id)
    );
  };

  const getBalances = (transactionsToCalculate = transactions) => {
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