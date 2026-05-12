import { useState } from "react";
import { X } from "lucide-react";

const brands = ["Wooly", "Gleemour", "Jung"];
const categories = [
  "Venta",
  "Inventario",
  "Publicidad",
  "Operaciones",
  "Logística",
  "Tecnología",
  "Personal",
  "Otros",
];

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState("income");
  const [brand, setBrand] = useState("Wooly");
  const [category, setCategory] = useState("Venta");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;

    onSave({
      type,
      brand,
      category,
      amount,
      method: "Manual",
      note,
    });

    setAmount("");
    setNote("");
    setType("income");
    setBrand("Wooly");
    setCategory("Venta");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Nuevo movimiento</p>
            <h2 className="text-2xl font-black">Registrar</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-zinc-800 p-2 text-zinc-300 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <form className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("Venta");
              }}
              className={`rounded-2xl px-4 py-3 font-bold ${
                type === "income"
                  ? "bg-emerald-500 text-black"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Ingreso
            </button>

            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("Inventario");
              }}
              className={`rounded-2xl px-4 py-3 font-bold ${
                type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Gasto
            </button>
          </div>

          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white"
          >
            {brands.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Monto S/"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-2xl font-black outline-none"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Nota rápida"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 outline-none"
          />

          <button
            type="button"
            onClick={handleSave}
            className="mt-2 rounded-2xl bg-white px-4 py-4 font-black text-black active:scale-[0.98]"
          >
            Guardar movimiento
          </button>
        </form>
      </div>
    </div>
  );
}