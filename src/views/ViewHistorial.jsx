import {
  Activity,
  ChevronRight,
  Download,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "../components/ui/Card";
import MonthNavigator from "../components/ui/MonthNavigator";
import TransactionItem from "../components/transactions/TransactionItem";

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function ViewHistorial({
  monthTransactions,
  deleteTransaction,
  onEdit,
  monthlySummary,
  global,
  currentMonth,
  onPrev,
  onNext,
  settings,
  iconGallery,
  dateFormatter,
}) {
  const handleExport = () => {
    const headers = [
      "ID",
      "Fecha",
      "Tipo",
      "Marca_Origen",
      "Destino",
      "Categoría",
      "Monto",
      "Usuario",
      "Nota",
      "Detalle Pagos",
    ];

    const rows = monthTransactions.map((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleString("es-PE");
      const dest =
        transaction.type === "transferencia" ? transaction.toBrand : "";
      const brand =
        transaction.type === "transferencia"
          ? transaction.fromBrand
          : transaction.brand;
      const splits = transaction.splits
        ? transaction.splits
            .map((split) => `${split.method}:${split.amount}`)
            .join(" | ")
        : transaction.toMethod;

      const cleanStr = (value) =>
        `"${(value || "").toString().replace(/"/g, '""')}"`;

      return [
        transaction.id,
        date,
        transaction.type,
        brand,
        dest,
        transaction.category || "transferencia",
        transaction.amount,
        transaction.createdBy,
        cleanStr(transaction.note),
        cleanStr(splits),
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `movimientos_${currentMonth.getFullYear()}_${
        currentMonth.getMonth() + 1
      }.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpis = [
    {
      t: "saldo histórico",
      v: global.total,
      i: Wallet,
      c: "bg-blue-500",
    },
    {
      t: "ingresos (mes)",
      v: monthlySummary.income,
      i: TrendingUp,
      c: "bg-emerald-500",
    },
    {
      t: "gastos (mes)",
      v: monthlySummary.expense,
      i: TrendingDown,
      c: "bg-rose-500",
    },
    {
      t: "balance (mes)",
      v: monthlySummary.income - monthlySummary.expense,
      i: Activity,
      c: "bg-[#6a1b9a]",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button className="bg-[#6a1b9a] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center shadow-lg shadow-purple-500/20">
          <span className="mr-2">todas</span>
          <ChevronRight size={14} className="rotate-90" />
        </button>

        <div className="flex space-x-2">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <Search size={16} />
          </button>

          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <Filter size={16} />
          </button>

          <button
            onClick={handleExport}
            className="w-10 h-10 rounded-full bg-[#6a1b9a] text-white flex items-center justify-center hover:scale-105 shadow-md transition-transform"
            title="descargar csv mensual"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-2">
        {kpis.map((item, index) => {
          const Icon = item.i;

          return (
            <div
              key={index}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm min-w-[160px] flex items-center space-x-3"
            >
              <div
                className={`w-10 h-10 ${item.c} rounded-full flex items-center justify-center text-white shrink-0`}
              >
                <Icon size={18} />
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 leading-tight">
                  {item.t}
                </p>

                <p className="text-sm md:text-base font-bold text-slate-800 no-lowercase">
                  {FORMATTER.format(item.v)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <MonthNavigator
          currentMonth={currentMonth}
          onPrev={onPrev}
          onNext={onNext}
        />

        <div className="bg-slate-50/50 p-4 md:p-6 min-h-[300px]">
          {monthTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-32 h-32 mb-4 opacity-50 bg-[url('https://cdn-icons-png.flaticon.com/512/7486/7486747.png')] bg-contain bg-no-repeat bg-center" />

              <p className="font-medium text-sm">
                sin resultados para {formatMonthYear(currentMonth)}
              </p>
            </div>
          ) : (
            monthTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                txn={transaction}
                onDelete={deleteTransaction}
                onEdit={onEdit}
                settings={settings}
                iconGallery={iconGallery}
                formatter={FORMATTER}
                dateFormatter={dateFormatter}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}