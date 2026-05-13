import { useMemo, useState } from "react";

import AddTransactionModal from "./components/transactions/AddTransactionModal";
import TransactionItem from "./components/transactions/TransactionItem";

import { useTransactionsStore } from "./hooks/useTransactionsStore";
import { FORMATTER } from "./utils/formatters";

export default function App() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    settings,
    getBalances,
  } = useTransactionsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  const { global, byBrand } = getBalances();

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const handleSave = (data) => {
    if (data.id) {
      updateTransaction(data.id, data);
    } else {
      addTransaction(data);
    }
  };

  const openNewModal = () => {
    setEditingTxn(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTxn(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTxn(null);
  };

  return (
    <main className="min-h-screen bg-[#f4f7fa] text-slate-900">
      <div className="mx-auto min-h-screen max-w-md p-5 pb-28">
        <header className="mb-6">
          <p className="text-sm font-bold text-slate-400">
            founder control center
          </p>

          <h1 className="mt-1 text-4xl font-black text-slate-900">
            ceo
          </h1>
        </header>

        <section className="mb-5 rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400">
            saldo actual histórico
          </p>

          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {FORMATTER.format(global.total)}
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-600">
                ingresos
              </p>
              <p className="mt-1 text-lg font-black text-emerald-700">
                {FORMATTER.format(global.income)}
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-xs font-bold text-rose-600">
                gastos
              </p>
              <p className="mt-1 text-lg font-black text-rose-700">
                {FORMATTER.format(global.expense)}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-3">
          {Object.entries(byBrand).map(([brandName, data]) => (
            <div
              key={brandName}
              className="rounded-3xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-800">{brandName}</p>
                <p className="font-black text-slate-900">
                  {FORMATTER.format(data.total)}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <span className="rounded-xl bg-slate-50 p-2 font-bold text-slate-500">
                  bcp {FORMATTER.format(data.bcp)}
                </span>
                <span className="rounded-xl bg-slate-50 p-2 font-bold text-slate-500">
                  cash {FORMATTER.format(data.cash)}
                </span>
                <span className="rounded-xl bg-slate-50 p-2 font-bold text-slate-500">
                  yape {FORMATTER.format(data.yape)}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400">
                actividad reciente
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                movimientos
              </h2>
            </div>
          </div>

          {recentTransactions.map((txn) => (
            <TransactionItem
              key={txn.id}
              txn={txn}
              settings={settings}
              onEdit={openEditModal}
              onDelete={deleteTransaction}
            />
          ))}
        </section>
      </div>

      <button
        onClick={openNewModal}
        className="fixed bottom-6 left-1/2 z-50 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#6a1b9a] text-3xl font-black text-white shadow-2xl shadow-purple-500/40 active:scale-95"
      >
        +
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingTxn}
        settings={settings}
      />
    </main>
  );
}