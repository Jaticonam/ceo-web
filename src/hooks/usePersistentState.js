import { useEffect, useState } from "react";

export default function usePersistentState(
  key,
  defaultValue
) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);

      return saved
        ? JSON.parse(saved)
        : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(state)
    );
  }, [key, state]);

  return [state, setState];
}