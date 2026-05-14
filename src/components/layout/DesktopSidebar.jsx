import { BarChart2, Plus, Settings } from "lucide-react";

export default function DesktopSidebar({
  currentTab,
  setCurrentTab,
  menuItems,
  onNewTransaction,
}) {
  return (
    <aside className="hidden md:flex flex-col w-[80px] bg-white border-r border-slate-100 h-screen py-8 items-center justify-between z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="w-10 h-10 bg-[#6a1b9a] text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <BarChart2 size={24} />
        </div>

        <button
          onClick={onNewTransaction}
          className="w-12 h-12 bg-[#6a1b9a] text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all"
          title="nuevo registro"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        <nav className="flex flex-col items-center space-y-4 w-full px-4">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full p-3 rounded-2xl flex justify-center transition-all ${
                  currentTab === item.id
                    ? "bg-purple-50 text-[#6a1b9a]"
                    : "text-slate-400 hover:text-[#6a1b9a] hover:bg-slate-50"
                }`}
                title={item.label}
              >
                <Icon
                  size={22}
                  strokeWidth={currentTab === item.id ? 2.5 : 2}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setCurrentTab("configuracion")}
        className={`p-3 transition-colors rounded-2xl ${
          currentTab === "configuracion"
            ? "bg-purple-50 text-[#6a1b9a]"
            : "text-slate-400 hover:text-[#6a1b9a]"
        }`}
        title="configuración"
      >
        <Settings size={22} />
      </button>
    </aside>
  );
}