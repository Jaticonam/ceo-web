function money(value) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE")}`;
}

export default function DashboardCards({ summary }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">Caja Total</p>

        <h2 className="mt-2 text-4xl font-black">
          {money(summary.cash)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Ingresos</p>

          <h3 className="mt-2 text-2xl font-black text-emerald-400">
            + {money(summary.income)}
          </h3>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Gastos</p>

          <h3 className="mt-2 text-2xl font-black text-red-400">
            - {money(summary.expenses)}
          </h3>
        </div>
      </div>
    </div>
  );
}