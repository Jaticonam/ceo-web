import {
  Activity,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import MonthNavigator from "../components/ui/MonthNavigator";

const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function ViewPresupuestos({
  currentMonth,
  onPrev,
  onNext,
}) {
  const cards = [
    {
      l: "ingresos del mes",
      i: TrendingUp,
      c: "bg-emerald-500",
    },
    {
      l: "gastos planeados",
      i: TrendingDown,
      c: "bg-rose-500",
    },
    {
      l: "balance planeado",
      i: Activity,
      c: "bg-[#6a1b9a]",
    },
    {
      l: "economía planeada",
      i: Wallet,
      c: "bg-teal-700",
      val: "0.00%",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="mb-12">
            <MonthNavigator
              currentMonth={currentMonth}
              onPrev={onPrev}
              onNext={onNext}
            />
          </div>

          <div className="w-40 h-40 mb-6 bg-[url('https://cdn-icons-png.flaticon.com/512/3281/3281289.png')] bg-contain bg-no-repeat bg-center opacity-80" />

          <p className="text-slate-400 font-medium mb-6">
            ningún presupuesto definido para {formatMonthYear(currentMonth)}.
          </p>

          <button className="bg-[#6a1b9a] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 mb-4 hover:scale-105 transition-transform">
            definir nuevas metas
          </button>

          <button className="text-[#6a1b9a] text-xs font-bold uppercase tracking-wider">
            copiar los objetivos del mes anterior
          </button>
        </div>

        <div className="w-full lg:w-72 space-y-4">
          {cards.map((item, index) => {
            const Icon = item.i;

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1">
                    {item.l}
                  </p>

                  <p className="text-xl font-bold text-slate-800 no-lowercase">
                    {item.val || "s/ 0.00"}
                  </p>
                </div>

                <div
                  className={`w-10 h-10 rounded-full ${item.c} text-white flex items-center justify-center`}
                >
                  <Icon size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}