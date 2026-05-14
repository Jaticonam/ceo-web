import {
  ChevronRight,
  MoreVertical,
  Search,
  User,
} from "lucide-react";

export default function AppHeader({
  currentTab,
  currentUser,
  setCurrentUser,
  users,
}) {
  return (
    <header className="px-6 py-4 md:py-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl md:text-2xl font-black text-slate-800 md:hidden">
          ceo.
        </h1>

        {currentTab === "presupuestos" && (
          <button className="hidden md:flex bg-[#6a1b9a] text-white px-5 py-2.5 rounded-full font-bold text-sm items-center shadow-md">
            presupuestos mensuales
            <ChevronRight size={14} className="rotate-90 ml-2" />
          </button>
        )}

        {currentTab === "informes" && (
          <h2 className="hidden md:block text-2xl font-bold text-slate-800">
            informes
          </h2>
        )}

        {currentTab === "configuracion" && (
          <h2 className="hidden md:block text-2xl font-bold text-slate-800">
            configuración del sistema
          </h2>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:flex space-x-2 mr-4">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800">
            <Search size={18} />
          </button>

          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-3 bg-white pl-1.5 pr-4 py-1.5 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 relative group">
          <select
            value={currentUser}
            onChange={(event) => setCurrentUser(event.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 relative bg-slate-50">
            <User size={16} />

            {currentUser.includes("ceo") && (
              <div className="absolute -top-1.5 -right-1.5 text-[10px]">
                👑
              </div>
            )}
          </div>

          <span className="text-xs font-bold text-slate-800">
            {currentUser.split(" ")[0]}
          </span>

          <ChevronRight size={14} className="rotate-90 text-slate-300" />
        </div>
      </div>
    </header>
  );
}