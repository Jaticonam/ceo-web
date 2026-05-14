import {
  createContext,
  useContext,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({
  children,
}) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({
    title,
    type = "success",
  }) => {
    const id = crypto.randomUUID();

    const toast = {
      id,
      title,
      type,
    };

    setToasts((current) => [
      ...current,
      toast,
    ]);

    setTimeout(() => {
      setToasts((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    }, 2500);
  };

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      {children}

      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-2xl animate-in slide-in-from-right duration-300 ${
              toast.type === "error"
                ? "bg-rose-500"
                : "bg-emerald-500"
            }`}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}