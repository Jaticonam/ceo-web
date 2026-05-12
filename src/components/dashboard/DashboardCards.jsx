export default function DashboardCards() {
  return (
    <div className="grid gap-4">

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Caja Total
        </p>

        <h2 className="mt-2 text-4xl font-black">
          S/ 18,420
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">
            Ingresos
          </p>

          <h3 className="mt-2 text-2xl font-black text-emerald-400">
            + S/ 2,840
          </h3>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">
            Gastos
          </p>

          <h3 className="mt-2 text-2xl font-black text-red-400">
            - S/ 980
          </h3>
        </div>

      </div>

    </div>
  );
}