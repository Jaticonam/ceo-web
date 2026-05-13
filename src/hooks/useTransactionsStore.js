import { useEffect, useState } from "react";

import { USERS } from "../constants/users";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { SEED_DATA } from "../data/seedData";

export default function useTransactionsStore() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("ceo_user_v4") || USERS[0];
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("ceo_transactions_v4");
      return saved ? JSON.parse(saved) : SEED_DATA;
    } catch {
      return SEED_DATA;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ceo_settings_v4");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
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
    localStorage.setItem("ceo_user_v4", currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ceo_settings_v4", JSON.stringify(settings));
  }, [settings]);

  const addTransaction = (transactionData) => {
    const amount =
      transactionData.type === "transferencia"
        ? parseFloat(transactionData.amount) || 0
        : transactionData.splits.reduce(
            (sum, split) => sum + (parseFloat(split.amount) || 0),
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
        ? parseFloat(updatedData.amount) || 0
        : updatedData.splits.reduce(
            (sum, split) => sum + (parseFloat(split.amount) || 0),
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
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  const getBalances = (transactionsToCalculate = transactions) => {
    const global = {
      total: 0,
      income: 0,
      expense: 0,
      bcp: 0,
      cash: 0,
      yape: 0,
    };

    const byBrand = {};

    settings.brands.forEach((brand) => {
      byBrand[brand.name] = {
        total: 0,
        bcp: 0,
        cash: 0,
        yape: 0,
        icon: brand.icon,
        color: brand.color,
      };
    });

    const classifyMethod = (methodName) => {
      const method = settings.methods.find(
        (item) => item.name === methodName
      );

      if (method) return method.type;

      const normalized = String(methodName || "").toLowerCase();

      if (
        normalized.includes("bcp") ||
        normalized.includes("ibk") ||
        normalized.includes("tarjeta")
      ) {
        return "bcp";
      }

      if (normalized.includes("efectivo")) {
        return "cash";
      }

      if (
        normalized.includes("yape") ||
        normalized.includes("plin")
      ) {
        return "yape";
      }

      return "other";
    };

    transactionsToCalculate.forEach((transaction) => {
      if (transaction.brand && !byBrand[transaction.brand]) {
        byBrand[transaction.brand] = {
          total: 0,
          bcp: 0,
          cash: 0,
          yape: 0,
          icon: "store",
          color: "bg-slate-400",
        };
      }

      if (transaction.fromBrand && !byBrand[transaction.fromBrand]) {
        byBrand[transaction.fromBrand] = {
          total: 0,
          bcp: 0,
          cash: 0,
          yape: 0,
          icon: "store",
          color: "bg-slate-400",
        };
      }

      if (transaction.toBrand && !byBrand[transaction.toBrand]) {
        byBrand[transaction.toBrand] = {
          total: 0,
          bcp: 0,
          cash: 0,
          yape: 0,
          icon: "store",
          color: "bg-slate-400",
        };
      }

      const amount = parseFloat(transaction.amount) || 0;

      if (
        transaction.type === "ingreso" ||
        transaction.type === "gasto"
      ) {
        const isIncome = transaction.type === "ingreso";

        if (isIncome) {
          global.income += amount;
          global.total += amount;
        } else {
          global.expense += amount;
          global.total -= amount;
        }

        if (byBrand[transaction.brand]) {
          byBrand[transaction.brand].total += isIncome
            ? amount
            : -amount;
        }

        transaction.splits?.forEach((split) => {
          const splitAmount = parseFloat(split.amount) || 0;
          const bucket = classifyMethod(split.method);

          if (bucket !== "other") {
            global[bucket] += isIncome ? splitAmount : -splitAmount;

            if (byBrand[transaction.brand]) {
              byBrand[transaction.brand][bucket] += isIncome
                ? splitAmount
                : -splitAmount;
            }
          }
        });
      }

      if (transaction.type === "transferencia") {
        const fromBucket = classifyMethod(transaction.fromMethod);
        const toBucket = classifyMethod(transaction.toMethod);

        if (fromBucket !== "other") {
          global[fromBucket] -= amount;
        }

        if (toBucket !== "other") {
          global[toBucket] += amount;
        }

        if (byBrand[transaction.fromBrand]) {
          byBrand[transaction.fromBrand].total -= amount;

          if (fromBucket !== "other") {
            byBrand[transaction.fromBrand][fromBucket] -= amount;
          }
        }

        if (byBrand[transaction.toBrand]) {
          byBrand[transaction.toBrand].total += amount;

          if (toBucket !== "other") {
            byBrand[transaction.toBrand][toBucket] += amount;
          }
        }
      }
    });

    return {
      global,
      byBrand,
    };
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