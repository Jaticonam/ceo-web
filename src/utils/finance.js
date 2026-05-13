export function classifyMethod(methodName, methods = []) {
  const method = methods.find((item) => item.name === methodName);

  if (method) return method.type;

  const normalized = String(methodName || "").toLowerCase();

  if (
    normalized.includes("bcp") ||
    normalized.includes("ibk") ||
    normalized.includes("tarjeta") ||
    normalized.includes("stripe") ||
    normalized.includes("transferencia")
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
}

export function calculateBalances(transactions = [], settings) {
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

  const ensureBrand = (brandName) => {
    if (!brandName) return;

    if (!byBrand[brandName]) {
      byBrand[brandName] = {
        total: 0,
        bcp: 0,
        cash: 0,
        yape: 0,
        icon: "store",
        color: "bg-slate-700",
      };
    }
  };

  transactions.forEach((transaction) => {
    ensureBrand(transaction.brand);
    ensureBrand(transaction.fromBrand);
    ensureBrand(transaction.toBrand);

    const amount = Number(transaction.amount || 0);

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
        const splitAmount = Number(split.amount || 0);
        const bucket = classifyMethod(split.method, settings.methods);

        if (bucket === "other") return;

        global[bucket] += isIncome ? splitAmount : -splitAmount;

        if (byBrand[transaction.brand]) {
          byBrand[transaction.brand][bucket] += isIncome
            ? splitAmount
            : -splitAmount;
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
}