import { Plus } from "lucide-react";

export default function MobileBottomNav({
  currentTab,
  setCurrentTab,
  menuItems,
  onNewTransaction,
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/80 px-2 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center max-w-lg mx-auto relative">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isCenter = item.id === "nuevo";

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={onNewTransaction}
                className="relative -top-5 w-16 h-16 bg-[#6a1b9a] rounded-full flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 border-4 border-[#f7f8fc] active:scale-95 transition-transform"
              >
                <Plus size={30} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 w-16 pt-2 transition-colors ${
                currentTab === item.id
                  ? "text-[#6a1b9a]"
                  : "text-slate-400"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={currentTab === item.id ? 2.5 : 2}
              />

              <span className="text-[10px] font-bold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}