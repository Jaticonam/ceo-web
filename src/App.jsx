import { useState } from "react";
import DashboardCards from "./components/dashboard/DashboardCards";
import BottomNav from "./components/ui/BottomNav";
import FloatingButton from "./components/ui/FloatingButton";
import AddTransactionModal from "./components/transactions/AddTransactionModal";
import { useTransactionsStore } from "./store/transactionsStore";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addTransaction, summary } = useTransactionsStore();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <section className="flex-1 p-6 pb-28">
          <header className="mb-8">
            <p className="text-sm text-zinc-400">Founder Control Center</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">CEO</h1>
          </header>

          <DashboardCards summary={summary} />
        </section>

        <FloatingButton onClick={() => setIsModalOpen(true)} />
        <BottomNav />

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={addTransaction}
        />
      </div>
    </main>
  );
}