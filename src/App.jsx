import { useMemo, useState } from "react";

import ViewInicio from "./views/ViewInicio";
import ViewEmpresas from "./views/ViewEmpresas";
import ViewHistorial from "./views/ViewHistorial";
import ViewPresupuestos from "./views/ViewPresupuestos";
import ViewInformes from "./views/ViewInformes";
import ViewConfiguracion from "./views/ViewConfiguracion";

import AddTransactionModal from "./components/transactions/AddTransactionModal";

import DesktopSidebar from "./components/layout/DesktopSidebar";
import AppHeader from "./components/layout/AppHeader";
import MobileBottomNav from "./components/layout/MobileBottomNav";

import useTransactionsStore from "./hooks/useTransactionsStore";
import useAnalytics from "./hooks/useAnalytics";
import { filterTransactionsByMonth } from "./services/finance/filters";

import { USERS } from "./constants/users";
import { ICON_GALLERY, DATE_FORMATTER } from "./constants/ui";
import { MENU_ITEMS, DESKTOP_MENU_ITEMS } from "./constants/menu";

export default function App() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentUser,
    setCurrentUser,
    getBalances,
    settings,
    setSettings,
  } = useTransactionsStore();

  const [currentTab, setCurrentTab] = useState("inicio");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const openNewModal = () => {
    setEditingTxn(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTxn(null);
  };

  const openEditModal = (transaction) => {
    setEditingTxn(transaction);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => {
    setSelectedMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const monthTransactions = useMemo(() => {
    return filterTransactionsByMonth({
      transactions,
      selectedMonth,
    });
  }, [transactions, selectedMonth]);

  const { global, byBrand } = getBalances();

  const { global: monthlySummary } =
    getBalances(monthTransactions);

  const {
    expenseChartData,
    monthlyTrendData,
  } = useAnalytics({
    transactions,
    monthTransactions,
  });

  const handleSave = (data) => {
    if (data.id) {
      updateTransaction(data.id, data);
    } else {
      addTransaction(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex overflow-hidden selection:bg-purple-200">
      <DesktopSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        menuItems={DESKTOP_MENU_ITEMS}
        onNewTransaction={openNewModal}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AppHeader
          currentTab={currentTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={USERS}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-8 pb-32 md:pb-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            {currentTab === "inicio" && (
              <ViewInicio
                global={global}
                monthlySummary={monthlySummary}
              />
            )}

            {currentTab === "empresas" && (
              <ViewEmpresas
                byBrand={byBrand}
                iconGallery={ICON_GALLERY}
              />
            )}

            {currentTab === "historial" && (
              <ViewHistorial
                monthTransactions={monthTransactions}
                deleteTransaction={deleteTransaction}
                onEdit={openEditModal}
                monthlySummary={monthlySummary}
                global={global}
                currentMonth={selectedMonth}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                settings={settings}
                iconGallery={ICON_GALLERY}
                dateFormatter={DATE_FORMATTER}
              />
            )}

            {currentTab === "presupuestos" && (
              <ViewPresupuestos
                currentMonth={selectedMonth}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
              />
            )}

            {currentTab === "informes" && (
              <ViewInformes
                expenseChartData={expenseChartData}
                monthlyTrendData={monthlyTrendData}
              />
            )}

            {currentTab === "configuracion" && (
              <ViewConfiguracion
                settings={settings}
                setSettings={setSettings}
                iconGallery={ICON_GALLERY}
              />
            )}
          </div>
        </main>

        <MobileBottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          menuItems={MENU_ITEMS}
          onNewTransaction={openNewModal}
        />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingTxn}
        settings={settings}
      />
    </div>
  );
}