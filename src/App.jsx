import Card from "./components/ui/Card";
import MonthNavigator from "./components/ui/MonthNavigator";
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
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend 
} from 'recharts';

const USERS = ['julio (ceo)', 'ana (ops)', 'carlos (ventas)'];

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

const DEFAULT_SETTINGS = {
  brands: [
    { id: 'b1', name: 'wooly', icon: 'store', color: 'bg-blue-500' },
    { id: 'b2', name: 'gleemour', icon: 'star', color: 'bg-emerald-500' },
    { id: 'b3', name: 'jung inversiones', icon: 'briefcase', color: 'bg-indigo-500' },
    { id: 'b4', name: 'otra', icon: 'component', color: 'bg-slate-500' }
  ],
  categories: {
    ingreso: [
      { id: 'i1', name: 'ventas', icon: 'shopping_cart', color: 'bg-emerald-500' },
      { id: 'i2', name: 'servicios', icon: 'briefcase', color: 'bg-blue-500' },
      { id: 'i3', name: 'rendimientos', icon: 'zap', color: 'bg-amber-500' },
      { id: 'i4', name: 'aporte capital', icon: 'banknote', color: 'bg-indigo-500' },
      { id: 'i5', name: 'otros ingresos', icon: 'plus', color: 'bg-slate-500' }
    ],
    gasto: [
      { id: 'g1', name: 'marketing', icon: 'monitor', color: 'bg-rose-500' },
      { id: 'g2', name: 'planilla', icon: 'smile', color: 'bg-[#6a1b9a]' },
      { id: 'g3', name: 'inventario', icon: 'truck', color: 'bg-amber-500' },
      { id: 'g4', name: 'suscripciones', icon: 'laptop', color: 'bg-blue-500' },
      { id: 'g5', name: 'impuestos', icon: 'shield', color: 'bg-rose-600' },
      { id: 'g6', name: 'operativa', icon: 'coffee', color: 'bg-slate-600' },
      { id: 'g7', name: 'otros gastos', icon: 'component', color: 'bg-slate-500' }
    ]
  },
  methods: [
    { id: 'm1', name: 'transferencia (bcp)', type: 'bcp', icon: 'briefcase', color: 'bg-blue-500' },
    { id: 'm2', name: 'transferencia (ibk)', type: 'bcp', icon: 'briefcase', color: 'bg-emerald-500' },
    { id: 'm3', name: 'yape', type: 'yape', icon: 'smartphone', color: 'bg-[#6a1b9a]' },
    { id: 'm4', name: 'plin', type: 'yape', icon: 'smartphone', color: 'bg-rose-500' },
    { id: 'm5', name: 'efectivo', type: 'cash', icon: 'banknote', color: 'bg-emerald-600' },
    { id: 'm6', name: 'tarjeta crédito', type: 'bcp', icon: 'store', color: 'bg-amber-500' },
    { id: 'm7', name: 'pasarela (stripe)', type: 'bcp', icon: 'globe', color: 'bg-indigo-500' }
  ]
};

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

const SEED_DATA = [
  { id: '1', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'ingreso', brand: 'wooly', category: 'ventas', amount: 4500, createdBy: 'ana (ops)', note: 'cierre fin de semana', splits: [{ method: 'yape', amount: 1500 }, { method: 'efectivo', amount: 1000 }, { method: 'transferencia (bcp)', amount: 2000 }] },
  { id: '2', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'gasto', brand: 'gleemour', category: 'marketing', amount: 1200, createdBy: 'julio (ceo)', note: 'pauta meta ads', splits: [{ method: 'tarjeta crédito', amount: 1200 }] },
  { id: '3', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), type: 'ingreso', brand: 'jung inversiones', category: 'rendimientos', amount: 850, createdBy: 'julio (ceo)', note: 'dividendos fondo a', splits: [{ method: 'transferencia (bcp)', amount: 850 }] },
  { id: '4', createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), type: 'gasto', brand: 'wooly', category: 'planilla', amount: 3200, createdBy: 'ana (ops)', note: 'quincena equipo ventas', splits: [{ method: 'transferencia (bcp)', amount: 3200 }] },
  { id: '5', createdAt: new Date(Date.now() - 86400000 * 18).toISOString(), type: 'ingreso', brand: 'wooly', category: 'ventas', amount: 2100, createdBy: 'carlos (ventas)', note: 'ventas canal digital', splits: [{ method: 'yape', amount: 1100 }, { method: 'plin', amount: 1000 }] },
  { id: '6', createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), type: 'gasto', brand: 'otra', category: 'operativa', amount: 450, createdBy: 'ana (ops)', note: 'caja chica oficina', splits: [{ method: 'efectivo', amount: 450 }] },
  { id: '7', createdAt: new Date(Date.now() - 86400000 * 22).toISOString(), type: 'ingreso', brand: 'gleemour', category: 'ventas', amount: 5600, createdBy: 'carlos (ventas)', note: 'lanzamiento nueva colección', splits: [{ method: 'transferencia (ibk)', amount: 3000 }, { method: 'pasarela (stripe)', amount: 2600 }] },
  { id: '8', createdAt: new Date(Date.now() - 86400000 * 25).toISOString(), type: 'transferencia', fromBrand: 'wooly', fromMethod: 'efectivo', toBrand: 'jung inversiones', toMethod: 'transferencia (bcp)', amount: 1000, createdBy: 'julio (ceo)', note: 'depósito de caja a banco' },
  { id: '9', createdAt: new Date(Date.now() - 86400000 * 28).toISOString(), type: 'gasto', brand: 'jung inversiones', category: 'impuestos', amount: 1500, createdBy: 'julio (ceo)', note: 'pago igv', splits: [{ method: 'transferencia (bcp)', amount: 1500 }] },
  { id: '10', createdAt: new Date(Date.now() - 86400000 * 32).toISOString(), type: 'gasto', brand: 'gleemour', category: 'inventario', amount: 2800, createdBy: 'ana (ops)', note: 'pago proveedores tela mes anterior', splits: [{ method: 'transferencia (bcp)', amount: 2800 }] },
];

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

function useTransactionsStore() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('ceo_user_v4') || USERS[0]);
  const [transactions, setTransactions] = useState(() => {
    try { const saved = localStorage.getItem('ceo_transactions_v4'); return saved ? JSON.parse(saved) : SEED_DATA; } 
    catch (e) { return SEED_DATA; }
  });
  
  // Nuevo estado para la configuración (Marcas, Categorías, Métodos)
  const [settings, setSettings] = useState(() => {
    try { const saved = localStorage.getItem('ceo_settings_v4'); return saved ? JSON.parse(saved) : DEFAULT_SETTINGS; } 
    catch (e) { return DEFAULT_SETTINGS; }
  });

  useEffect(() => { localStorage.setItem('ceo_transactions_v4', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ceo_user_v4', currentUser); }, [currentUser]);
  useEffect(() => { localStorage.setItem('ceo_settings_v4', JSON.stringify(settings)); }, [settings]);

  const addTransaction = (txnData) => {
    let amount = txnData.type === 'transferencia' ? parseFloat(txnData.amount) || 0 : txnData.splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
    const newTxn = { ...txnData, amount, createdBy: currentUser, id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() };
    setTransactions(prev => [newTxn, ...prev].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const updateTransaction = (id, updatedData) => {
    let amount = updatedData.type === 'transferencia' ? parseFloat(updatedData.amount) || 0 : updatedData.splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData, amount } : t).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  // Función núcleo para calcular saldos basados en la configuración dinámica
  const getBalances = (txnsToCalculate = transactions) => {
    let global = { total: 0, income: 0, expense: 0, bcp: 0, cash: 0, yape: 0 };
    let byBrand = {};
    
    // Inicializar marcas desde la configuración
    settings.brands.forEach(b => byBrand[b.name] = { total: 0, bcp: 0, cash: 0, yape: 0, icon: b.icon, color: b.color });

    const classifyMethod = (methodName) => {
      const m = settings.methods.find(x => x.name === methodName);
      if (m) return m.type; // 'bcp', 'cash', 'yape'
      // Fallback para datos antiguos si el método fue borrado
      if ((methodName||'').includes('bcp') || (methodName||'').includes('ibk') || (methodName||'').includes('tarjeta')) return 'bcp';
      if ((methodName||'').includes('efectivo')) return 'cash';
      if ((methodName||'').includes('yape') || (methodName||'').includes('plin')) return 'yape';
      return 'other';
    };

    txnsToCalculate.forEach(t => {
      // Si hay una marca en el historial que fue borrada, la agregamos dinámicamente para no romper la app
      if (t.brand && !byBrand[t.brand]) byBrand[t.brand] = { total: 0, bcp: 0, cash: 0, yape: 0, icon: 'store', color: 'bg-slate-400' };
      if (t.fromBrand && !byBrand[t.fromBrand]) byBrand[t.fromBrand] = { total: 0, bcp: 0, cash: 0, yape: 0, icon: 'store', color: 'bg-slate-400' };
      if (t.toBrand && !byBrand[t.toBrand]) byBrand[t.toBrand] = { total: 0, bcp: 0, cash: 0, yape: 0, icon: 'store', color: 'bg-slate-400' };

      const amt = parseFloat(t.amount) || 0;
      
      if (t.type === 'ingreso' || t.type === 'gasto') {
        const isInc = t.type === 'ingreso';
        if (isInc) { global.income += amt; global.total += amt; } else { global.expense += amt; global.total -= amt; }
        if (byBrand[t.brand]) byBrand[t.brand].total += isInc ? amt : -amt;

        t.splits?.forEach(s => {
          const sAmt = parseFloat(s.amount) || 0;
          const bucket = classifyMethod(s.method);
          if (bucket !== 'other') {
            if (isInc) global[bucket] += sAmt; else global[bucket] -= sAmt;
            if (byBrand[t.brand]) {
              if (isInc) byBrand[t.brand][bucket] += sAmt; else byBrand[t.brand][bucket] -= sAmt;
            }
          }
        });
      } else if (t.type === 'transferencia') {
        const fromBucket = classifyMethod(t.fromMethod);
        const toBucket = classifyMethod(t.toMethod);
        
        if (fromBucket !== 'other') global[fromBucket] -= amt;
        if (toBucket !== 'other') global[toBucket] += amt;

        if (byBrand[t.fromBrand]) {
          byBrand[t.fromBrand].total -= amt;
          if (fromBucket !== 'other') byBrand[t.fromBrand][fromBucket] -= amt;
        }
        if (byBrand[t.toBrand]) {
          byBrand[t.toBrand].total += amt;
          if (toBucket !== 'other') byBrand[t.toBrand][toBucket] += amt;
        }
      }
    });

    return { global, byBrand };
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction, currentUser, setCurrentUser, getBalances, settings, setSettings };
}

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

const AddTransactionModal = ({ isOpen, onClose, onSave, initialData, settings }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('gasto'); 
  
  // Extraer listas dinámicas (asegurando fallbacks vacíos si se borró todo)
  const brandNames = settings.brands.map(b => b.name);
  const methodNames = settings.methods.map(m => m.name);
  const incomeCats = settings.categories.ingreso.map(c => c.name);
  const expenseCats = settings.categories.gasto.map(c => c.name);

  const [brand, setBrand] = useState(brandNames[0] || '');
  const [category, setCategory] = useState(expenseCats[0] || '');
  const [splits, setSplits] = useState([{ method: methodNames[0] || '', amount: '' }]);
  
  const [fromBrand, setFromBrand] = useState(brandNames[0] || '');
  const [fromMethod, setFromMethod] = useState(methodNames[0] || '');
  const [toBrand, setToBrand] = useState(brandNames[1] || brandNames[0] || ''); 
  const [toMethod, setToMethod] = useState(methodNames[0] || '');
  const [transferAmount, setTransferAmount] = useState('');

  const [note, setNote] = useState('');
  const [inputDate, setInputDate] = useState(formatInputDate());
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { 
    if (isOpen) {
      if (initialData) {
        setStep(2); 
        setType(initialData.type);
        setInputDate(formatInputDate(initialData.createdAt));
        setNote(initialData.note || '');
        
        if (initialData.type === 'transferencia') {
          setFromBrand(initialData.fromBrand); setFromMethod(initialData.fromMethod);
          setToBrand(initialData.toBrand); setToMethod(initialData.toMethod);
          setTransferAmount(initialData.amount);
        } else {
          setBrand(initialData.brand);
          setCategory(initialData.category);
          setSplits(initialData.splits || [{ method: methodNames[0] || '', amount: '' }]);
        }
      } else {
        setStep(1);
        setSplits([{ method: methodNames[0] || '', amount: '' }]);
        setTransferAmount(''); setNote(''); setInputDate(formatInputDate()); setErrorMsg('');
        setBrand(brandNames[0] || '');
        setCategory(expenseCats[0] || '');
      }
    }
  }, [isOpen, initialData, settings]);

  const handleSelectType = (selectedType) => {
    setType(selectedType);
    if (selectedType === 'ingreso') setCategory(incomeCats[0] || '');
    else if (selectedType === 'gasto') setCategory(expenseCats[0] || '');
    setStep(2);
  };

  const currentTotal = splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const finalDate = new Date(inputDate).toISOString();

    let dataToSave = { type, note, createdAt: finalDate };
    if (initialData) dataToSave.id = initialData.id;

    if (type === 'transferencia') {
      if (!transferAmount || parseFloat(transferAmount) <= 0) return setErrorMsg('ingresa un monto válido.');
      dataToSave = { ...dataToSave, fromBrand, fromMethod, toBrand, toMethod, amount: parseFloat(transferAmount) };
    } else {
      if (currentTotal <= 0) return setErrorMsg('el total debe ser mayor a 0.');
      const validSplits = splits.filter(s => parseFloat(s.amount) > 0);
      dataToSave = { ...dataToSave, brand, category, splits: validSplits };
    }
    
    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
        
        {step === 1 ? (
          <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-8">
              <div>
                 <h2 className="text-2xl font-black text-slate-800">nuevo registro</h2>
                 <p className="text-sm font-medium text-slate-500 mt-1">¿qué tipo de operación deseas realizar?</p>
              </div>
              <button onClick={onClose} className="p-3 -mt-2 -mr-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <button onClick={() => handleSelectType('ingreso')} className="w-full p-5 flex items-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl transition-all group active:scale-[0.98]">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform shrink-0"><TrendingUp size={28} strokeWidth={2.5}/></div>
                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-emerald-700">ingreso</h3>
                  <p className="text-sm font-bold text-emerald-600/70 mt-0.5">registrar entrada de dinero</p>
                </div>
              </button>

              <button onClick={() => handleSelectType('gasto')} className="w-full p-5 flex items-center bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl transition-all group active:scale-[0.98]">
                <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform shrink-0"><TrendingDown size={28} strokeWidth={2.5}/></div>
                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-rose-700">gasto</h3>
                  <p className="text-sm font-bold text-rose-600/70 mt-0.5">registrar salida o pago</p>
                </div>
              </button>

              <button onClick={() => handleSelectType('transferencia')} className="w-full p-5 flex items-center bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-all group active:scale-[0.98]">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform shrink-0"><ArrowRightLeft size={28} strokeWidth={2.5}/></div>
                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-blue-800">mover dinero</h3>
                  <p className="text-sm font-bold text-blue-600/70 mt-0.5">transferencias entre tus cuentas</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-white shadow-sm z-10">
              <div className="flex items-center">
                 {!initialData && <button type="button" onClick={() => setStep(1)} className="p-2 mr-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft size={20}/></button>}
                 <h2 className={`text-xl font-black ${type === 'ingreso' ? 'text-emerald-600' : type === 'gasto' ? 'text-rose-600' : 'text-blue-600'}`}>
                    {initialData ? 'editar ' : 'registro de '}{type}
                 </h2>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300 pb-20 sm:pb-6">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center">
                 <Calendar size={18} className="text-slate-400 mr-3 shrink-0" />
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">fecha y hora del movimiento</label>
                    <input type="datetime-local" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none no-lowercase" required />
                 </div>
              </div>

              {type === 'transferencia' ? (
                <div className="space-y-5">
                  <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-2xl">
                    <label className="text-xs font-bold text-rose-600 block mb-3">origen (sale de)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={fromBrand} onChange={(e) => setFromBrand(e.target.value)} className="w-full p-3 bg-white border border-rose-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-200">
                        {brandNames.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <select value={fromMethod} onChange={(e) => setFromMethod(e.target.value)} className="w-full p-3 bg-white border border-rose-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-200">
                        {methodNames.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-2xl">
                    <label className="text-xs font-bold text-emerald-600 block mb-3">destino (entra a)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={toBrand} onChange={(e) => setToBrand(e.target.value)} className="w-full p-3 bg-white border border-emerald-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-200">
                        {brandNames.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <select value={toMethod} onChange={(e) => setToMethod(e.target.value)} className="w-full p-3 bg-white border border-emerald-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-200">
                        {methodNames.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl no-lowercase">s/</span>
                    <input type="number" step="0.01" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all no-lowercase" />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">marca</label>
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-colors">
                        {brandNames.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">categoría</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-colors">
                        {(type === 'ingreso' ? incomeCats : expenseCats).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 block mb-3">medios de pago (dividir)</label>
                    <div className="space-y-3">
                      {splits.map((split, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <select value={split.method} onChange={(e) => { const n = [...splits]; n[index].method = e.target.value; setSplits(n); }} className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-slate-400">
                            {methodNames.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <input type="number" step="0.01" value={split.amount} onChange={(e) => { const n = [...splits]; n[index].amount = e.target.value; setSplits(n); }} placeholder="0.00" className="w-24 p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-slate-400 no-lowercase" required={splits.length === 1} />
                          {splits.length > 1 && <button type="button" onClick={() => setSplits(splits.filter((_, i) => i !== index))} className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 rounded-xl"><X size={18}/></button>}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setSplits([...splits, { method: methodNames[0] || '', amount: '' }])} className="mt-3 w-full py-3 text-xs font-bold text-slate-500 bg-white border border-slate-200 border-dashed hover:border-slate-300 rounded-xl transition-colors"><Plus size={14} className="inline mr-1"/> agregar método</button>
                    
                    <div className="mt-5 pt-4 border-t border-slate-200/60 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                       <span className="text-sm font-bold text-slate-500">total en tiempo real:</span>
                       <span className={`text-2xl font-black no-lowercase ${type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {FORMATTER.format(currentTotal)}
                       </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">nota (opcional)</label>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="detalle de la operación..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all" />
              </div>

              {errorMsg && <div className="p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl flex items-center"><AlertCircle size={16} className="mr-2"/>{errorMsg}</div>}

              <button type="submit" className={`w-full py-4 text-white text-base font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${type === 'transferencia' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : type === 'ingreso' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'}`}>
                {initialData ? 'guardar cambios' : `confirmar ${type}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const ViewConfiguracion = ({ settings, setSettings }) => {
  const [subTab, setSubTab] = useState('empresas');
  const [newItemName, setNewItemName] = useState('');
  const [newItemIcon, setNewItemIcon] = useState('store');
  const [newItemColor, setNewItemColor] = useState('bg-blue-500');
  const [newItemType, setNewItemType] = useState('bcp');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: newItemName.trim().toLowerCase(),
      icon: newItemIcon,
      color: newItemColor
    };

    const newSettings = { ...settings };
    if (subTab === 'empresas') newSettings.brands.push(newItem);
    else if (subTab === 'ingresos') newSettings.categories.ingreso.push(newItem);
    else if (subTab === 'gastos') newSettings.categories.gasto.push(newItem);
    else if (subTab === 'metodos') {
      newItem.type = newItemType;
      newSettings.methods.push(newItem);
    }
    
    setSettings(newSettings);
    setNewItemName('');
  };

  const handleDeleteItem = (id) => {
    const newSettings = { ...settings };
    if (subTab === 'empresas') newSettings.brands = newSettings.brands.filter(i => i.id !== id);
    else if (subTab === 'ingresos') newSettings.categories.ingreso = newSettings.categories.ingreso.filter(i => i.id !== id);
    else if (subTab === 'gastos') newSettings.categories.gasto = newSettings.categories.gasto.filter(i => i.id !== id);
    else if (subTab === 'metodos') newSettings.methods = newSettings.methods.filter(i => i.id !== id);
    setSettings(newSettings);
  };

  const listToRender = subTab === 'empresas' ? settings.brands : 
                       subTab === 'ingresos' ? settings.categories.ingreso : 
                       subTab === 'gastos' ? settings.categories.gasto : settings.methods;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto">
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto scrollbar-hide">
        {['empresas', 'ingresos', 'gastos', 'metodos'].map(t => (
          <button key={t} onClick={() => setSubTab(t)} className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl capitalize transition-all whitespace-nowrap ${subTab === t ? 'bg-[#6a1b9a] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <Card className="bg-slate-50/50 border-dashed border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">crear nuevo registro</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">nombre</label>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder={`ej. ${subTab === 'metodos' ? 'paypal' : 'nueva marca'}`} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#6a1b9a]"/>
            </div>
            {subTab === 'metodos' && (
              <div className="w-1/3">
                <label className="text-xs font-bold text-slate-500 block mb-1">clasificación financiera</label>
                <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#6a1b9a]">
                  <option value="bcp">bancos (digital)</option>
                  <option value="cash">efectivo (físico)</option>
                  <option value="yape">billeteras (yape/plin)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">elige un icono</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Object.keys(ICON_GALLERY).map(iconKey => {
                const Icon = ICON_GALLERY[iconKey];
                return (
                  <button key={iconKey} onClick={() => setNewItemIcon(iconKey)} className={`p-3 rounded-xl border flex-shrink-0 transition-all ${newItemIcon === iconKey ? 'bg-white border-[#6a1b9a] text-[#6a1b9a] shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-100'}`}>
                    <Icon size={20} />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">elige un color</label>
            <div className="flex gap-3">
              {COLOR_GALLERY.map(c => (
                <button key={c} onClick={() => setNewItemColor(c)} className={`w-8 h-8 rounded-full ${c} ${newItemColor === c ? 'ring-4 ring-offset-2 ring-slate-300' : ''} transition-all`}></button>
              ))}
            </div>
          </div>

          <button onClick={handleAddItem} disabled={!newItemName.trim()} className="mt-4 px-6 py-3 bg-[#6a1b9a] text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 transition-colors">
            guardar {subTab}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listToRender.map(item => {
          const Icon = ICON_GALLERY[item.icon] || Store;
          return (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${item.color} text-white`}><Icon size={18}/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">{item.name}</p>
                  {item.type && <p className="text-[10px] text-slate-400 font-bold uppercase">{item.type === 'bcp' ? 'bancos' : item.type === 'cash' ? 'efectivo' : 'billeteras'}</p>}
                </div>
              </div>
              {listToRender.length > 1 && (
                <button onClick={() => handleDeleteItem(item.id)} className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

const ViewInicio = ({ global, monthlySummary }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">vista general</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white"><Wallet size={20}/></div>
            <div>
              <p className="text-xs font-bold text-slate-500">saldo actual (histórico)</p>
              <p className="text-xl font-bold text-slate-900 no-lowercase">{FORMATTER.format(global.total)}</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white"><TrendingUp size={20}/></div>
            <div>
              <p className="text-xs font-bold text-slate-500">ingresos del mes</p>
              <p className="text-xl font-bold text-slate-900 no-lowercase">{FORMATTER.format(monthlySummary.income)}</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white"><TrendingDown size={20}/></div>
            <div>
              <p className="text-xs font-bold text-slate-500">gastos del mes</p>
              <p className="text-xl font-bold text-slate-900 no-lowercase">{FORMATTER.format(monthlySummary.expense)}</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>

    <Card className="mt-8">
       <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><PieIcon size={20} className="mr-2 text-slate-400"/> distribución de liquidez global</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
             <span className="text-sm font-bold text-blue-600 mb-1">dinero en bancos (bcp/ibk)</span>
             <span className="text-3xl font-black text-blue-900 no-lowercase">{FORMATTER.format(global.bcp)}</span>
          </div>
          <div className="flex flex-col p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
             <span className="text-sm font-bold text-emerald-600 mb-1">efectivo físico</span>
             <span className="text-3xl font-black text-emerald-900 no-lowercase">{FORMATTER.format(global.cash)}</span>
          </div>
       </div>
    </Card>
  </div>
);

const ViewEmpresas = ({ byBrand }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">estado histórico por marcas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Object.entries(byBrand).map(([brandName, data]) => {
        const Icon = ICON_GALLERY[data.icon] || Store;
        return (
          <Card key={brandName} className="group hover:border-blue-200 transition-colors relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${data.color} opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`}></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-lg font-black text-slate-800 flex items-center capitalize">
                <div className={`w-8 h-8 rounded-xl ${data.color} text-white flex items-center justify-center mr-3 shadow-md`}>
                  <Icon size={16}/>
                </div>
                {brandName}
              </h3>
              <span className="text-xl font-bold text-slate-900 no-lowercase">{FORMATTER.format(data.total)}</span>
            </div>
            <div className="space-y-3 relative z-10">
               <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center"><div className="w-2 h-2 rounded-full bg-[#6a1b9a] mr-2"></div>billeteras (yape)</span>
                  <span className="font-bold text-slate-800 no-lowercase">{FORMATTER.format(data.yape)}</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>bancos</span>
                  <span className="font-bold text-slate-800 no-lowercase">{FORMATTER.format(data.bcp)}</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-500 flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>efectivo</span>
                  <span className="font-bold text-slate-800 no-lowercase">{FORMATTER.format(data.cash)}</span>
               </div>
            </div>
          </Card>
        )
      })}
    </div>
  </div>
);

const ViewHistorial = ({ transactions, monthTransactions, deleteTransaction, onEdit, monthlySummary, global, currentMonth, onPrev, onNext, settings }) => {
  const handleExport = () => {
    const headers = ['ID', 'Fecha', 'Tipo', 'Marca_Origen', 'Destino', 'Categoría', 'Monto', 'Usuario', 'Nota', 'Detalle Pagos'];
    const rows = monthTransactions.map(t => {
      const date = new Date(t.createdAt).toLocaleString('es-PE');
      const dest = t.type === 'transferencia' ? t.toBrand : '';
      const brand = t.type === 'transferencia' ? t.fromBrand : t.brand;
      const splits = t.splits ? t.splits.map(s => `${s.method}:${s.amount}`).join(' | ') : t.toMethod;
      const cleanStr = (s) => `"${(s||'').toString().replace(/"/g, '""')}"`;
      return [t.id, date, t.type, brand, dest, t.category || 'transferencia', t.amount, t.createdBy, cleanStr(t.note), cleanStr(splits)].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `movimientos_${currentMonth.getFullYear()}_${currentMonth.getMonth()+1}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <button className="bg-[#6a1b9a] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center shadow-lg shadow-purple-500/20">
            <span className="mr-2">todas</span> <ChevronRight size={14} className="rotate-90"/>
         </button>
         <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"><Search size={16}/></button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"><Filter size={16}/></button>
            <button onClick={handleExport} className="w-10 h-10 rounded-full bg-[#6a1b9a] text-white flex items-center justify-center hover:scale-105 shadow-md transition-transform" title="descargar csv mensual"><Download size={16}/></button>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-2">
        {[
          { t: 'saldo histórico', v: global.total, i: Wallet, c: 'bg-blue-500' },
          { t: 'ingresos (mes)', v: monthlySummary.income, i: TrendingUp, c: 'bg-emerald-500' },
          { t: 'gastos (mes)', v: monthlySummary.expense, i: TrendingDown, c: 'bg-rose-500' },
          { t: 'balance (mes)', v: monthlySummary.income - monthlySummary.expense, i: Activity, c: 'bg-[#6a1b9a]' }
        ].map((k, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm min-w-[160px] flex items-center space-x-3">
             <div className={`w-10 h-10 ${k.c} rounded-full flex items-center justify-center text-white shrink-0`}><k.i size={18}/></div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 leading-tight">{k.t}</p>
                <p className="text-sm md:text-base font-bold text-slate-800 no-lowercase">{FORMATTER.format(k.v)}</p>
             </div>
          </div>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <MonthNavigator currentMonth={currentMonth} onPrev={onPrev} onNext={onNext} />
        
        <div className="bg-slate-50/50 p-4 md:p-6 min-h-[300px]">
          {monthTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
               <div className="w-32 h-32 mb-4 opacity-50 bg-[url('https://cdn-icons-png.flaticon.com/512/7486/7486747.png')] bg-contain bg-no-repeat bg-center"></div>
               <p className="font-medium text-sm">sin resultados para {formatMonthYear(currentMonth)}</p>
            </div>
          ) : (
            monthTransactions.map(txn => <TransactionItem
              key={txn.id}
              txn={txn}
              onDelete={deleteTransaction}
              onEdit={onEdit}
              settings={settings}
              iconGallery={ICON_GALLERY}
              formatter={FORMATTER}
              dateFormatter={DATE_FORMATTER}
            />)
          )}
        </div>
      </Card>
    </div>
  );
};

const ViewPresupuestos = ({ currentMonth, onPrev, onNext }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
         <div className="mb-12"><MonthNavigator currentMonth={currentMonth} onPrev={onPrev} onNext={onNext} /></div>
         <div className="w-40 h-40 mb-6 bg-[url('https://cdn-icons-png.flaticon.com/512/3281/3281289.png')] bg-contain bg-no-repeat bg-center opacity-80"></div>
         <p className="text-slate-400 font-medium mb-6">ningún presupuesto definido para {formatMonthYear(currentMonth)}.</p>
         <button className="bg-[#6a1b9a] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 mb-4 hover:scale-105 transition-transform">definir nuevas metas</button>
         <button className="text-[#6a1b9a] text-xs font-bold uppercase tracking-wider">copiar los objetivos del mes anterior</button>
      </div>
      <div className="w-full lg:w-72 space-y-4">
         {[
           { l: 'ingresos del mes', i: TrendingUp, c: 'bg-emerald-500' },
           { l: 'gastos planeados', i: TrendingDown, c: 'bg-rose-500' },
           { l: 'balance planeado', i: Activity, c: 'bg-[#6a1b9a]' },
           { l: 'economía planeada', i: Wallet, c: 'bg-teal-700', val: '0.00%' }
         ].map((k, i) => (
           <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-xs font-bold text-slate-400 mb-1">{k.l}</p>
                 <p className="text-xl font-bold text-slate-800 no-lowercase">{k.val || 's/ 0.00'}</p>
              </div>
              <div className={`w-10 h-10 rounded-full ${k.c} text-white flex items-center justify-center`}><k.i size={18}/></div>
           </div>
         ))}
      </div>
    </div>
  </div>
);

const ViewInformes = ({ monthTransactions, currentMonth, onPrev, onNext, settings }) => {
  const [chartType, setChartType] = useState('pie');
  
  const pieData = useMemo(() => {
    const categories = {};
    monthTransactions.filter(t => t.type === 'gasto').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
    });
    return Object.keys(categories).map(k => {
      const catDef = settings.categories.gasto.find(c => c.name === k);
      const colorClass = catDef ? catDef.color : 'bg-slate-500';
      // Mapear tailwind class a hex aproxi (simplificado para recharts)
      const hexColor = colorClass.includes('blue') ? '#3b82f6' : colorClass.includes('emerald') ? '#10b981' : colorClass.includes('rose') ? '#f43f5e' : colorClass.includes('9a') ? '#6a1b9a' : colorClass.includes('amber') ? '#f59e0b' : '#64748b';
      return { name: k, value: categories[k], color: hexColor };
    });
  }, [monthTransactions, settings]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex shadow-sm">
          <button onClick={() => setChartType('pie')} className={`px-6 py-2 rounded-xl transition-all ${chartType === 'pie' ? 'bg-[#6a1b9a] text-white shadow-md' : 'text-slate-400 hover:text-slate-800'}`}><PieIcon size={20}/></button>
          <button onClick={() => setChartType('line')} className={`px-6 py-2 rounded-xl transition-all ${chartType === 'line' ? 'bg-[#6a1b9a] text-white shadow-md' : 'text-slate-400 hover:text-slate-800'}`}><LineIcon size={20}/></button>
          <button onClick={() => setChartType('bar')} className={`px-6 py-2 rounded-xl transition-all ${chartType === 'bar' ? 'bg-[#6a1b9a] text-white shadow-md' : 'text-slate-400 hover:text-slate-800'}`}><BarChart2 size={20}/></button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-100 px-6 py-2.5 rounded-full flex items-center text-sm font-bold text-slate-500 shadow-sm">
            gastos por categoría <ChevronRight size={14} className="ml-2 rotate-90"/>
          </button>
          <button className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-sm"><Filter size={16}/></button>
        </div>
      </div>

      <Card className="flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
         <div className="mb-8 w-full justify-center flex"><MonthNavigator currentMonth={currentMonth} onPrev={onPrev} onNext={onNext} /></div>
         
         <div className="w-full h-[350px]">
           {pieData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} cx="50%" cy="50%" innerRadius={90} outerRadius={130} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                 </Pie>
                 <RechartsTooltip formatter={(value) => FORMATTER.format(value)} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <div className="w-40 h-40 mb-4 bg-[url('https://cdn-icons-png.flaticon.com/512/7486/7486747.png')] bg-contain bg-no-repeat bg-center opacity-60"></div>
               <p className="font-medium text-sm">sin resultados para {formatMonthYear(currentMonth)}</p>
             </div>
           )}
         </div>
      </Card>
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
             {currentTab === 'empresas' && <ViewEmpresas byBrand={byBrand} />}
             {currentTab === 'historial' && <ViewHistorial transactions={transactions} monthTransactions={monthTransactions} deleteTransaction={deleteTransaction} onEdit={openEditModal} monthlySummary={monthlySummary} global={global} currentMonth={selectedMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} settings={settings} />}
             {currentTab === 'presupuestos' && <ViewPresupuestos currentMonth={selectedMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} />}
             {currentTab === 'informes' && <ViewInformes monthTransactions={monthTransactions} currentMonth={selectedMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} settings={settings} />}
             {currentTab === 'configuracion' && <ViewConfiguracion settings={settings} setSettings={setSettings} />}
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