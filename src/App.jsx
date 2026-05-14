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

import { useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useToast } from "./context/ToastContext";

import useUiState from "./hooks/useUiState";
import useMonthNavigation from "./hooks/useMonthNavigation";
import useTransactionActions from "./hooks/useTransactionActions";
import useNavigationState from "./hooks/useNavigationState";

import { USERS } from "./constants/users";
import { ICON_GALLERY, DATE_FORMATTER } from "./constants/ui";
import { MENU_ITEMS, DESKTOP_MENU_ITEMS } from "./constants/menu";

export default function App() {
  const {
    addTransaction,
    updateTransaction,
    deleteTransaction,

    currentUser,
    setCurrentUser,

    settings,
    setSettings,

    selectedMonth,
    setSelectedMonth,

    monthTransactions,

    global,
    byBrand,
    monthlySummary,

    expenseChartData,
    monthlyTrendData,
  } = useAppContext();

  const { showToast } = useToast();

  const { currentTab, setCurrentTab } = useNavigationState();

  const {
    isModalOpen,
    editingTxn,
    openNewModal,
    openEditModal,
    closeModal,
  } = useUiState();

  const { handlePrevMonth, handleNextMonth } = useMonthNavigation({
    setSelectedMonth,
  });

  const { handleSave } = useTransactionActions({
    addTransaction,
    updateTransaction,
  });

  const handleSaveAndShowImpact = (data) => {
    handleSave(data);

    setCurrentTab("inicio");
    setDashboardPulse(true);

    showToast({
      title: data.id
        ? "movimiento actualizado"
        : "movimiento registrado",
    });

    setTimeout(() => {
      setDashboardPulse(false);
    }, 1200);
  };

  const [dashboardPulse, setDashboardPulse] = useState(false);

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
                byBrand={byBrand}
                onOpenCompanies={() => setCurrentTab("empresas")}
                highlight={dashboardPulse}
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
        onSave={handleSaveAndShowImpact}
        initialData={editingTxn}
        settings={settings}
      />
    </div>
  );
}