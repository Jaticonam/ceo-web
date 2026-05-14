import { classifyMethod } from "./methods";

export function calculateBalances({
  transactions,
  settings,
}) {
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

  transactions.forEach((transaction) => {
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
        const splitAmount =
          parseFloat(split.amount) || 0;

        const bucket = classifyMethod(
          split.method,
          settings.methods
        );

        if (bucket !== "other") {
          global[bucket] += isIncome
            ? splitAmount
            : -splitAmount;

          if (byBrand[transaction.brand]) {
            byBrand[transaction.brand][bucket] +=
              isIncome
                ? splitAmount
                : -splitAmount;
          }
        }
      });
    }

    if (transaction.type === "transferencia") {
      const fromBucket = classifyMethod(
        transaction.fromMethod,
        settings.methods
      );

      const toBucket = classifyMethod(
        transaction.toMethod,
        settings.methods
      );

      if (fromBucket !== "other") {
        global[fromBucket] -= amount;
      }

      if (toBucket !== "other") {
        global[toBucket] += amount;
      }

      if (byBrand[transaction.fromBrand]) {
        byBrand[transaction.fromBrand].total -= amount;

        if (fromBucket !== "other") {
          byBrand[transaction.fromBrand][fromBucket] -=
            amount;
        }
      }

      if (byBrand[transaction.toBrand]) {
        byBrand[transaction.toBrand].total += amount;

        if (toBucket !== "other") {
          byBrand[transaction.toBrand][toBucket] +=
            amount;
        }
      }
    }
  });

  return {
    global,
    byBrand,
  };
}