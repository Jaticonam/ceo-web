import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Landmark,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "../components/ui/Card";

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  helper,
}) {
  const tones = {
    blue: {
      icon: "bg-blue-500",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    emerald: {
      icon: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    rose: {
      icon: "bg-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
    amber: {
      icon: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  };

  const style = tones[tone];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${style.icon}`}
        >
          <Icon size={22} />
        </div>

        {helper && (
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-black ${style.bg} ${style.border} ${style.text}`}
          >
            {helper}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-900 no-lowercase">
        {FORMATTER.format(value)}
      </p>
    </div>
  );
}

export default function ViewInicio({
  global,
  monthlySummary,
  byBrand,
  onOpenCompanies,
  highlight = false,
}) {
  const monthlyBalance =
    Number(monthlySummary.income || 0) -
    Number(monthlySummary.expense || 0);

  const totalLiquidity = Number(global.total || 0);
  const bankLiquidity = Number(global.bcp || 0);
  const cashLiquidity = Number(global.cash || 0);
  const walletLiquidity = Number(global.yape || 0);

  const liquidityItems = [
    {
      label: "bancos",
      value: bankLiquidity,
      icon: Landmark,
      tone: "blue",
    },
    {
      label: "billeteras",
      value: walletLiquidity,
      icon: Wallet,
      tone: "amber",
    },
    {
      label: "efectivo",
      value: cashLiquidity,
      icon: Banknote,
      tone: "emerald",
    },
  ];

  const insight =
    monthlyBalance > 0
      ? "el mes está generando flujo positivo."
      : monthlyBalance < 0
        ? "el mes está consumiendo caja. revisar gastos."
        : "el mes está en equilibrio operativo.";

  const brandItems = Object.entries(byBrand || {})
  .map(([name, data]) => ({
    name,
    ...data,
  }))
  .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
  .slice(0, 4);

  return (
    <div
    className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 transition-all duration-500 ${
        highlight ? "scale-[1.01]" : "scale-100"
    }`}
    >
      <section
        className={`rounded-[2rem] bg-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10 transition-all duration-700 ${
            highlight ? "ring-4 ring-emerald-300/60 shadow-emerald-500/20" : ""
        }`}
        >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              centro de decisión
            </p>

            <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight no-lowercase">
              {FORMATTER.format(totalLiquidity)}
            </h2>

            <p className="mt-2 text-sm font-bold text-slate-400">
              liquidez global consolidada
            </p>
          </div>

          <div
            className={`rounded-2xl px-5 py-4 ${
              monthlyBalance >= 0
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-rose-500/10 text-rose-300"
            }`}
          >
            <p className="text-xs font-black uppercase">
              balance del mes
            </p>

            <p className="mt-1 text-2xl font-black no-lowercase">
              {FORMATTER.format(monthlyBalance)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="ingresos del mes"
          value={monthlySummary.income}
          icon={TrendingUp}
          tone="emerald"
          helper="entrada"
        />

        <MetricCard
          label="gastos del mes"
          value={monthlySummary.expense}
          icon={TrendingDown}
          tone="rose"
          helper="salida"
        />

        <MetricCard
          label="resultado operativo"
          value={monthlyBalance}
          icon={monthlyBalance >= 0 ? ArrowUpRight : ArrowDownRight}
          tone={monthlyBalance >= 0 ? "emerald" : "rose"}
          helper={monthlyBalance >= 0 ? "positivo" : "alerta"}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                distribución de liquidez
              </h3>

              <p className="text-sm font-bold text-slate-400 mt-1">
                dónde está realmente el dinero
              </p>
            </div>

            <PiggyBank className="text-slate-300" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liquidityItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-500">
                      {item.label}
                    </span>

                    <Icon size={18} className="text-slate-400" />
                  </div>

                  <p className="mt-3 text-2xl font-black text-slate-900 no-lowercase">
                    {FORMATTER.format(item.value)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 rounded-2xl p-3 ${
                monthlyBalance >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              <AlertCircle size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-800">
                lectura rápida
              </h3>

              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                {insight}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  foco recomendado
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {monthlyBalance >= 0
                    ? "centralizar excedente o reinvertir con control."
                    : "revisar categorías de gasto y salidas recientes."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                <h3 className="text-lg font-black text-slate-800">
                    empresas
                </h3>

                <p className="text-sm font-bold text-slate-400 mt-1">
                    liquidez por unidad operativa
                </p>
                </div>

                <button
                type="button"
                onClick={onOpenCompanies}
                className="text-xs font-black text-[#6a1b9a] hover:underline"
                >
                ver detalle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {brandItems.map((brand) => (
                <button
                    key={brand.name}
                    type="button"
                    onClick={onOpenCompanies}
                    className="text-left rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:bg-white hover:shadow-md transition-all"
                >
                    <p className="text-sm font-black text-slate-700 capitalize">
                    {brand.name}
                    </p>

                    <p
                    className={`mt-3 text-2xl font-black no-lowercase ${
                        brand.total >= 0
                        ? "text-slate-900"
                        : "text-rose-600"
                    }`}
                    >
                    {FORMATTER.format(brand.total)}
                    </p>

                    <p className="mt-2 text-xs font-bold text-slate-400">
                    tocar para ver detalle
                    </p>
                </button>
                ))}
            </div>
            </Card>


      </section>
    </div>
  );
}