import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  Calendar,
  ChevronLeft,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import { formatInputDate } from "../../utils/dates";
import { FORMATTER } from "../../utils/formatters";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  settings,
}) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("gasto");

  const brandNames = settings.brands.map((brand) => brand.name);
  const methodNames = settings.methods.map((method) => method.name);
  const incomeCategories = settings.categories.ingreso.map((cat) => cat.name);
  const expenseCategories = settings.categories.gasto.map((cat) => cat.name);

  const [brand, setBrand] = useState(brandNames[0] || "");
  const [category, setCategory] = useState(expenseCategories[0] || "");
  const [splits, setSplits] = useState([
    {
      method: methodNames[0] || "",
      amount: "",
    },
  ]);

  const [fromBrand, setFromBrand] = useState(brandNames[0] || "");
  const [fromMethod, setFromMethod] = useState(methodNames[0] || "");
  const [toBrand, setToBrand] = useState(brandNames[1] || brandNames[0] || "");
  const [toMethod, setToMethod] = useState(methodNames[0] || "");
  const [transferAmount, setTransferAmount] = useState("");

  const [note, setNote] = useState("");
  const [inputDate, setInputDate] = useState(formatInputDate());
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setStep(2);
      setType(initialData.type);
      setInputDate(formatInputDate(initialData.createdAt));
      setNote(initialData.note || "");
      setErrorMsg("");

      if (initialData.type === "transferencia") {
        setFromBrand(initialData.fromBrand);
        setFromMethod(initialData.fromMethod);
        setToBrand(initialData.toBrand);
        setToMethod(initialData.toMethod);
        setTransferAmount(initialData.amount);
      } else {
        setBrand(initialData.brand);
        setCategory(initialData.category);
        setSplits(
          initialData.splits || [
            {
              method: methodNames[0] || "",
              amount: "",
            },
          ]
        );
      }

      return;
    }

    setStep(1);
    setType("gasto");
    setSplits([
      {
        method: methodNames[0] || "",
        amount: "",
      },
    ]);
    setTransferAmount("");
    setNote("");
    setInputDate(formatInputDate());
    setErrorMsg("");
    setBrand(brandNames[0] || "");
    setCategory(expenseCategories[0] || "");
    setFromBrand(brandNames[0] || "");
    setFromMethod(methodNames[0] || "");
    setToBrand(brandNames[1] || brandNames[0] || "");
    setToMethod(methodNames[0] || "");
  }, [isOpen, initialData, settings]);

  if (!isOpen) return null;

  const currentTotal = splits.reduce(
    (sum, split) => sum + Number(split.amount || 0),
    0
  );

  const handleSelectType = (selectedType) => {
    setType(selectedType);

    if (selectedType === "ingreso") {
      setCategory(incomeCategories[0] || "");
    }

    if (selectedType === "gasto") {
      setCategory(expenseCategories[0] || "");
    }

    setStep(2);
  };

  const handleSplitChange = (index, field, value) => {
    setSplits((current) =>
      current.map((split, splitIndex) =>
        splitIndex === index
          ? {
              ...split,
              [field]: value,
            }
          : split
      )
    );
  };

  const handleAddSplit = () => {
    setSplits((current) => [
      ...current,
      {
        method: methodNames[0] || "",
        amount: "",
      },
    ]);
  };

  const handleRemoveSplit = (index) => {
    setSplits((current) =>
      current.filter((_, splitIndex) => splitIndex !== index)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMsg("");

    const finalDate = new Date(inputDate).toISOString();

    let dataToSave = {
      type,
      note,
      createdAt: finalDate,
    };

    if (initialData) {
      dataToSave.id = initialData.id;
    }

    if (type === "transferencia") {
      if (!transferAmount || Number(transferAmount) <= 0) {
        setErrorMsg("ingresa un monto válido.");
        return;
      }

      dataToSave = {
        ...dataToSave,
        fromBrand,
        fromMethod,
        toBrand,
        toMethod,
        amount: Number(transferAmount),
      };
    } else {
      if (currentTotal <= 0) {
        setErrorMsg("el total debe ser mayor a 0.");
        return;
      }

      const validSplits = splits.filter(
        (split) => Number(split.amount || 0) > 0
      );

      dataToSave = {
        ...dataToSave,
        brand,
        category,
        splits: validSplits,
      };
    }

    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl sm:rounded-3xl">
        {step === 1 ? (
          <div className="p-6 md:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  nuevo registro
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  ¿qué tipo de operación deseas realizar?
                </p>
              </div>

              <button
                onClick={onClose}
                className="-mr-2 -mt-2 rounded-full bg-slate-50 p-3 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSelectType("ingreso")}
                className="group flex w-full items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition-all hover:bg-emerald-100 active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
                  <TrendingUp size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-emerald-700">
                    ingreso
                  </h3>
                  <p className="mt-0.5 text-sm font-bold text-emerald-600/70">
                    registrar entrada de dinero
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectType("gasto")}
                className="group flex w-full items-center rounded-2xl border border-rose-100 bg-rose-50 p-5 transition-all hover:bg-rose-100 active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition-transform group-hover:scale-110">
                  <TrendingDown size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-rose-700">
                    gasto
                  </h3>
                  <p className="mt-0.5 text-sm font-bold text-rose-600/70">
                    registrar salida o pago
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectType("transferencia")}
                className="group flex w-full items-center rounded-2xl border border-blue-100 bg-blue-50 p-5 transition-all hover:bg-blue-100 active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                  <ArrowRightLeft size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-blue-800">
                    mover dinero
                  </h3>
                  <p className="mt-0.5 text-sm font-bold text-blue-600/70">
                    transferencias entre tus cuentas
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                {!initialData && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mr-3 rounded-full bg-slate-50 p-2 text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                <h2
                  className={`text-xl font-black ${
                    type === "ingreso"
                      ? "text-emerald-600"
                      : type === "gasto"
                        ? "text-rose-600"
                        : "text-blue-600"
                  }`}
                >
                  {initialData ? "editar " : "registro de "}
                  {type}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 overflow-y-auto p-6 pb-20 sm:pb-6"
            >
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Calendar size={18} className="mr-3 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                    fecha y hora del movimiento
                  </label>

                  <input
                    type="datetime-local"
                    value={inputDate}
                    onChange={(event) => setInputDate(event.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {type === "transferencia" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                    <label className="mb-3 block text-xs font-bold text-rose-600">
                      origen (sale de)
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={fromBrand}
                        onChange={(event) => setFromBrand(event.target.value)}
                        className="w-full rounded-xl border border-rose-100 bg-white p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        {brandNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>

                      <select
                        value={fromMethod}
                        onChange={(event) => setFromMethod(event.target.value)}
                        className="w-full rounded-xl border border-rose-100 bg-white p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        {methodNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <label className="mb-3 block text-xs font-bold text-emerald-600">
                      destino (entra a)
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={toBrand}
                        onChange={(event) => setToBrand(event.target.value)}
                        className="w-full rounded-xl border border-emerald-100 bg-white p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-200"
                      >
                        {brandNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>

                      <select
                        value={toMethod}
                        onChange={(event) => setToMethod(event.target.value)}
                        className="w-full rounded-xl border border-emerald-100 bg-white p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-200"
                      >
                        {methodNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                      s/
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      value={transferAmount}
                      onChange={(event) =>
                        setTransferAmount(event.target.value)
                      }
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-2xl font-bold text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-500">
                        marca
                      </label>

                      <select
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition-colors focus:border-slate-400 focus:bg-white"
                      >
                        {brandNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-500">
                        categoría
                      </label>

                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition-colors focus:border-slate-400 focus:bg-white"
                      >
                        {(type === "ingreso"
                          ? incomeCategories
                          : expenseCategories
                        ).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <label className="mb-3 block text-xs font-bold text-slate-500">
                      medios de pago (dividir)
                    </label>

                    <div className="space-y-3">
                      {splits.map((split, index) => (
                        <div
                          key={`${split.method}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <select
                            value={split.method}
                            onChange={(event) =>
                              handleSplitChange(
                                index,
                                "method",
                                event.target.value
                              )
                            }
                            className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium outline-none focus:border-slate-400"
                          >
                            {methodNames.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            step="0.01"
                            value={split.amount}
                            onChange={(event) =>
                              handleSplitChange(
                                index,
                                "amount",
                                event.target.value
                              )
                            }
                            placeholder="0.00"
                            className="w-24 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-slate-400"
                            required={splits.length === 1}
                          />

                          {splits.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSplit(index)}
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-rose-500"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSplit}
                      className="mt-3 w-full rounded-xl border border-dashed border-slate-200 bg-white py-3 text-xs font-bold text-slate-500 transition-colors hover:border-slate-300"
                    >
                      <Plus size={14} className="mr-1 inline" />
                      agregar método
                    </button>

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                      <span className="text-sm font-bold text-slate-500">
                        total en tiempo real:
                      </span>

                      <span
                        className={`text-2xl font-black ${
                          type === "ingreso"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {FORMATTER.format(currentTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500">
                  nota (opcional)
                </label>

                <input
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="detalle de la operación..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-600">
                  <AlertCircle size={16} className="mr-2" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className={`w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                  type === "transferencia"
                    ? "bg-blue-600 shadow-blue-500/30 hover:bg-blue-700"
                    : type === "ingreso"
                      ? "bg-emerald-500 shadow-emerald-500/30 hover:bg-emerald-600"
                      : "bg-rose-500 shadow-rose-500/30 hover:bg-rose-600"
                }`}
              >
                {initialData ? "guardar cambios" : `confirmar ${type}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}