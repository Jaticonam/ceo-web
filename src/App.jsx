export default function App() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col p-6">
        
        <header className="mb-8">
          <p className="text-sm text-zinc-400">
            Founder Control Center
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            CEO
          </h1>
        </header>

        <section className="grid gap-4">
          
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

        </section>

      </div>
    </main>
  )
}