import ViewInicio from "./views/ViewInicio";
import ViewEmpresas from "./views/ViewEmpresas";
import ViewHistorial from "./views/ViewHistorial";
import ViewPresupuestos from "./views/ViewPresupuestos";
import ViewInformes from "./views/ViewInformes";
import ViewConfiguracion from "./views/ViewConfiguracion";
import AddTransactionModal from "./components/transactions/AddTransactionModal";
import useTransactionsStore from "./hooks/useTransactionsStore";
import { USERS } from "./constants/users";



import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, List, Plus, TrendingUp, TrendingDown, Wallet, Building2, Tag, 
  CreditCard, X, FileText, Activity, AlertCircle, Share2, Trash2, 
  ArrowRightLeft, Search, Filter, MoreVertical, Flag, BarChart2,
  PieChart as PieIcon, LineChart as LineIcon, ChevronLeft, ChevronRight, User, Settings,
  Download, Edit2, Calendar,
  // Icon Gallery for Settings
  Store, Smartphone, Banknote, Zap, Briefcase, Coffee, ShoppingCart, 
  Monitor, Truck, Heart, Star, Gift, Car, Plane, Utensils, 
  Shirt, Laptop, Smile, Shield, Component, Palette, Camera, Book, 
  Music, Video, PenTool, Globe, Cpu, Rocket
} from 'lucide-react';


const FORMATTER = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const ICON_GALLERY = {
  store: Store,
  smartphone: Smartphone,
  banknote: Banknote,
  zap: Zap,
  briefcase: Briefcase,
  coffee: Coffee,
  shopping_cart: ShoppingCart,
  monitor: Monitor,
  truck: Truck,
  heart: Heart,
  star: Star,
  gift: Gift,
  car: Car,
  plane: Plane,
  home: Home,
  utensils: Utensils,
  shirt: Shirt,
  laptop: Laptop,
  smile: Smile,
  shield: Shield,
  component: Component,
  palette: Palette,
  camera: Camera,
  book: Book,
  music: Music,
  video: Video,
  pentool: PenTool,
  globe: Globe,
  cpu: Cpu,
  rocket: Rocket,
  plus: Plus
};
const COLOR_GALLERY = [
  'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-[#6a1b9a]', 
  'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500', 'bg-slate-700'
];


const formatInputDate = (isoString) => {
  const d = isoString ? new Date(isoString) : new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);
};

const isSameMonth = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};


const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    :root { font-family: 'Plus Jakarta Sans', sans-serif; }
    * { text-transform: lowercase !important; }
    .no-lowercase, .no-lowercase * { text-transform: none !important; }
    ::-webkit-scrollbar { width: 4px; background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `}} />
);

const TransactionItem = ({ txn, onDelete, onEdit, settings }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isTransfer = txn.type === 'transferencia';
  const isIncome = txn.type === 'ingreso';

  // Buscar configuración visual para la categoría o usar valores por defecto
  let displayIcon = isTransfer ? ArrowRightLeft : (isIncome ? TrendingUp : TrendingDown);
  let displayColor = isTransfer ? 'bg-blue-50 text-blue-600' : (isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600');
  
  if (!isTransfer && settings) {
    const catList = isIncome ? settings.categories.ingreso : settings.categories.gasto;
    const catDef = catList.find(c => c.name === txn.category);
    if (catDef) {
      displayIcon = ICON_GALLERY[catDef.icon] || displayIcon;
      displayColor = `${catDef.color} bg-opacity-10 text-slate-800`; // Estilo custom
    }
  }

  const IconComponent = displayIcon;

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-3 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 w-[65%] sm:w-3/4">
          <div className={`p-3 shrink-0 rounded-2xl ${displayColor} ${!displayColor.includes('text-') ? 'text-white' : ''}`}>
            <IconComponent size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{isTransfer ? 'transferencia interna' : txn.category}</p>
            <div className="flex flex-wrap items-center text-xs text-slate-500 mt-1 gap-1.5">
              {isTransfer ? (
                <> <span className="text-rose-500 font-medium">{txn.fromBrand}</span> <span>➔</span> <span className="text-emerald-500 font-medium">{txn.toBrand}</span> </>
              ) : (
                <> <span className="font-semibold text-slate-700">{txn.brand}</span> <span>•</span> <span>{DATE_FORMATTER.format(new Date(txn.createdAt))}</span> </>
              )}
            </div>
            {!isTransfer && txn.splits && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {txn.splits.map((s, i) => (
                  <span key={i} className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md">
                    {s.method}: s/{parseFloat(s.amount).toFixed(0)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end shrink-0 ml-2">
          <div className={`font-bold text-base no-lowercase ${isTransfer ? 'text-blue-600' : isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
            {isIncome ? '+' : isTransfer ? '' : '-'}{FORMATTER.format(txn.amount)}
          </div>
          <div className="mt-2 h-6 flex items-center justify-end space-x-1">
            {isDeleting ? (
              <div className="flex space-x-1 animate-in fade-in zoom-in duration-200">
                <button onClick={() => setIsDeleting(false)} className="text-[10px] px-2 py-1 bg-slate-200 rounded font-bold">cancelar</button>
                <button onClick={() => onDelete(txn.id)} className="text-[10px] px-2 py-1 bg-rose-500 text-white rounded font-bold">borrar</button>
              </div>
            ) : (
              <>
                <button onClick={() => onEdit(txn)} className="text-slate-300 hover:text-blue-500 p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity" title="editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setIsDeleting(true)} className="text-slate-300 hover:text-rose-500 p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity" title="eliminar">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {txn.note && (
        <div className="mt-3 pl-[56px] text-xs text-slate-500 italic flex items-start">
          <FileText size={12} className="mr-1.5 mt-0.5 shrink-0 opacity-50" />
          <span className="line-clamp-2">{txn.note}</span>
        </div>
      )}
    </div>
  );
};


export default function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, currentUser, setCurrentUser, getBalances, settings, setSettings } = useTransactionsStore();
  const [currentTab, setCurrentTab] = useState('inicio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePrevMonth = () => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const monthTransactions = useMemo(() => transactions.filter(t => isSameMonth(new Date(t.createdAt), selectedMonth)), [transactions, selectedMonth]);

  const { global, byBrand } = getBalances(); 
  const { global: monthlySummary } = getBalances(monthTransactions);

  const handleSave = (data) => {
    if (data.id) updateTransaction(data.id, data);
    else addTransaction(data);
  };

  const openEditModal = (txn) => {
    setEditingTxn(txn);
    setIsModalOpen(true);
  };

  const menuItems = [
    { id: 'inicio', icon: Home, label: 'inicio' },
    { id: 'empresas', icon: Building2, label: 'empresas' },
    { id: 'historial', icon: List, label: 'historial' },
    { id: 'presupuestos', icon: Flag, label: 'presupuestos' },
    { id: 'informes', icon: BarChart2, label: 'informes' },
    { id: 'configuracion', icon: Settings, label: 'ajustes' },
  ];

  const expenseChartData = useMemo(() => {
    const totals = {};

    monthTransactions
      .filter((transaction) => transaction.type === "gasto")
      .forEach((transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] || 0) +
          Number(transaction.amount || 0);
      });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [monthTransactions]);

  const monthlyTrendData = useMemo(() => {
    const months = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const key = date.toLocaleDateString("es-PE", {
        month: "short",
        year: "2-digit",
      });

      if (!months[key]) {
        months[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "ingreso") {
        months[key].income += Number(transaction.amount || 0);
      }

      if (transaction.type === "gasto") {
        months[key].expense += Number(transaction.amount || 0);
      }
    });

    return Object.values(months);
  }, [transactions]);

  
  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex overflow-hidden selection:bg-purple-200">
      <GlobalStyles />
      
      {/* SIDEBAR ESCRITORIO (SaaS Style) */}
      <aside className="hidden md:flex flex-col w-[80px] bg-white border-r border-slate-100 h-screen py-8 items-center justify-between z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="w-10 h-10 bg-[#6a1b9a] text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <BarChart2 size={24} />
          </div>
          
          <button onClick={() => { setEditingTxn(null); setIsModalOpen(true); }} className="w-12 h-12 bg-[#6a1b9a] text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all" title="nuevo registro">
            <Plus size={24} strokeWidth={2.5} />
          </button>

          <nav className="flex flex-col items-center space-y-4 w-full px-4">
            {menuItems.slice(0, 5).map(item => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)} className={`w-full p-3 rounded-2xl flex justify-center transition-all ${currentTab === item.id ? 'bg-purple-50 text-[#6a1b9a]' : 'text-slate-400 hover:text-[#6a1b9a] hover:bg-slate-50'}`} title={item.label}>
                <item.icon size={22} strokeWidth={currentTab === item.id ? 2.5 : 2} />
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setCurrentTab('configuracion')} className={`p-3 transition-colors rounded-2xl ${currentTab === 'configuracion' ? 'bg-purple-50 text-[#6a1b9a]' : 'text-slate-400 hover:text-[#6a1b9a]'}`} title="configuración">
           <Settings size={22}/>
        </button>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="px-6 py-4 md:py-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
          <div className="flex items-center space-x-3">
             <h1 className="text-xl md:text-2xl font-black text-slate-800 md:hidden">ceo.</h1>
             {currentTab === 'presupuestos' && <button className="hidden md:flex bg-[#6a1b9a] text-white px-5 py-2.5 rounded-full font-bold text-sm items-center shadow-md">presupuestos mensuales <ChevronRight size={14} className="rotate-90 ml-2"/></button>}
             {currentTab === 'informes' && <h2 className="hidden md:block text-2xl font-bold text-slate-800">informes</h2>}
             {currentTab === 'configuracion' && <h2 className="hidden md:block text-2xl font-bold text-slate-800">configuración del sistema</h2>}
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="hidden md:flex space-x-2 mr-4">
               <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800"><Search size={18}/></button>
               <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800"><MoreVertical size={18}/></button>
             </div>
             
             <div className="flex items-center space-x-3 bg-white pl-1.5 pr-4 py-1.5 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 relative group">
                <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                  {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 relative bg-slate-50">
                   <User size={16}/>
                   {currentUser.includes('ceo') && <div className="absolute -top-1.5 -right-1.5 text-[10px]">👑</div>}
                </div>
                <span className="text-xs font-bold text-slate-800">{currentUser.split(' ')[0]}</span>
                <ChevronRight size={14} className="rotate-90 text-slate-300"/>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8 pb-32 md:pb-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
             {currentTab === 'inicio' && <ViewInicio global={global} monthlySummary={monthlySummary} />}
             {currentTab === 'empresas' && (
                <ViewEmpresas
                  byBrand={byBrand}
                  iconGallery={ICON_GALLERY}
                />
              )}
             {currentTab === 'historial' && (
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

             {currentTab === 'presupuestos' && (
                <ViewPresupuestos
                  currentMonth={selectedMonth}
                  onPrev={handlePrevMonth}
                  onNext={handleNextMonth}
                />
              )}
             
             {currentTab === 'informes' && (
                <ViewInformes
                  expenseChartData={expenseChartData}
                  monthlyTrendData={monthlyTrendData}
                />
              )}

             {currentTab === 'configuracion' && (
                <ViewConfiguracion
                  settings={settings}
                  setSettings={setSettings}
                  iconGallery={ICON_GALLERY}
                />
              )}
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {menuItems.slice(0,4).map(item => (
            <button key={item.id} onClick={() => setCurrentTab(item.id)} className={`flex flex-col items-center space-y-1 w-14 transition-colors ${currentTab === item.id ? 'text-[#6a1b9a]' : 'text-slate-400'}`}>
              <item.icon size={22} strokeWidth={currentTab === item.id ? 2.5 : 2} />
              <span className="text-[9px] font-bold truncate w-full text-center">{item.label}</span>
            </button>
          ))}
          <button onClick={() => { setEditingTxn(null); setIsModalOpen(true); }} className="fixed bottom-20 right-6 w-14 h-14 bg-[#6a1b9a] text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 z-50 hover:scale-105 active:scale-95">
            <Plus size={26} />
          </button>
        </nav>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={editingTxn} settings={settings} />
    </div>
  );
}