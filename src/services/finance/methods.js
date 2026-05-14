export function classifyMethod(methodName, methods) {
  const method = methods.find(
    (item) => item.name === methodName
  );

  if (method) {
    return method.type;
  }

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
}