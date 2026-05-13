import Card from "../components/ui/Card";
import {
  ChevronRight,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});


    export default function ViewInicio({ global, monthlySummary }) {
    return (
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
}