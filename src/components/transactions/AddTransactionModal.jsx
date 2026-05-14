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

const FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

function formatInputDate(isoString) {
  const date = isoString ? new Date(isoString) : new Date();
  const pad = (number) => number.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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
  const incomeCats = settings.categories.ingreso.map((category) => category.name);
  const expenseCats = settings.categories.gasto.map((category) => category.name);

  const [brand, setBrand] = useState(brandNames[0] || "");
  const [category, setCategory] = useState(expenseCats[0] || "");
  const [splits, setSplits] = useState([
    { method: methodNames[0] || "", amount: "" },
  ]);

  const [fromBrand, setFromBrand] = useState(brandNames[0] || "");
  const [fromMethod, setFromMethod] = useState(methodNames[0] || "");
  const [toBrand, setToBrand] = useState(brandNames[1] || brandNames[0] || "");
  const [toMethod, setToMethod] = useState(methodNames[0] || "");
  const [transferAmount, setTransferAmount] = useState("");

  const [note, setNote] = useState("");
  const [inputDate, setInputDate] = useState(formatInputDate());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const isIncome = type === "ingreso";
  const isExpense = type === "gasto";
  const isTransfer = type === "transferencia";

  const currentTotal = splits.reduce(
    (sum, split) => sum + (parseFloat(split.amount) || 0),
    0
  );

  const primaryColor = isIncome
    ? "emerald"
    : isExpense
      ? "rose"
      : "blue";

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setStep(2);
      setType(initialData.type);

      setInputDate(
        formatInputDate(initialData.createdAt)
      );

      setUseCustomDate(true);

      setNote(initialData.note || "");

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
    setSplits([{ method: methodNames[0] || "", amount: "" }]);
    setTransferAmount("");
    setNote("");
    setInputDate(formatInputDate());
    setErrorMsg("");
    setBrand(brandNames[0] || "");
    setCategory(expenseCats[0] || "");
    setFromBrand(brandNames[0] || "");
    setFromMethod(methodNames[0] || "");
    setToBrand(brandNames[1] || brandNames[0] || "");
    setToMethod(methodNames[0] || "");
  }, [isOpen, initialData, settings]);

  if (!isOpen) return null;

  const handleSelectType = (selectedType) => {
    setType(selectedType);

    if (selectedType === "ingreso") {
      setCategory(incomeCats[0] || "");
    }

    if (selectedType === "gasto") {
      setCategory(expenseCats[0] || "");
    }

    setStep(2);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMsg("");

    const selectedDate = useCustomDate
      ? new Date(inputDate)
      : new Date();

    if (selectedDate > new Date()) {
      setErrorMsg("no puedes registrar movimientos futuros todavía.");
      return;
    }

    const finalDate = selectedDate.toISOString();

    let dataToSave = {
      type,
      note,
      createdAt: finalDate,
    };

    if (initialData) {
      dataToSave.id = initialData.id;
    }

    if (isTransfer) {
      if (!transferAmount || parseFloat(transferAmount) <= 0) {
        setErrorMsg("ingresa un monto válido.");
        return;
      }

      dataToSave = {
        ...dataToSave,
        fromBrand,
        fromMethod,
        toBrand,
        toMethod,
        amount: parseFloat(transferAmount),
      };
    } else {
      if (currentTotal <= 0) {
        setErrorMsg("el total debe ser mayor a 0.");
        return;
      }

      const validSplits = splits.filter(
        (split) => parseFloat(split.amount) > 0
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

  const actionLabel = initialData
    ? "guardar cambios"
    : isIncome
      ? "registrar ingreso"
      : isExpense
        ? "registrar gasto"
        : "registrar transferencia";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8">
        {step === 1 ? (
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  nuevo movimiento
                </h2>

                <p className="text-sm font-bold text-slate-400 mt-1">
                  elige qué quieres registrar
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-3 -mt-2 -mr-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSelectType("ingreso")}
                className="w-full p-5 flex items-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl transition-all group active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <TrendingUp size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-emerald-700">
                    ingreso
                  </h3>

                  <p className="text-sm font-bold text-emerald-600/70 mt-0.5">
                    entrada de dinero
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectType("gasto")}
                className="w-full p-5 flex items-center bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl transition-all group active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <TrendingDown size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-rose-700">
                    gasto
                  </h3>

                  <p className="text-sm font-bold text-rose-600/70 mt-0.5">
                    salida o pago
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSelectType("transferencia")}
                className="w-full p-5 flex items-center bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-all group active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <ArrowRightLeft size={28} strokeWidth={2.5} />
                </div>

                <div className="ml-5 text-left">
                  <h3 className="text-xl font-black text-blue-800">
                    transferencia
                  </h3>

                  <p className="text-sm font-bold text-blue-600/70 mt-0.5">
                    mover dinero entre cuentas
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-white z-10">
              <div className="flex items-center min-w-0">
                {!initialData && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-2 mr-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    {initialData ? "editando" : "nuevo registro"}
                  </p>

                  <h2
                    className={`text-xl font-black ${
                      isIncome
                        ? "text-emerald-600"
                        : isExpense
                          ? "text-rose-600"
                          : "text-blue-600"
                    }`}
                  >
                    {isIncome
                      ? "ingreso"
                      : isExpense
                        ? "gasto"
                        : "transferencia"}
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="p-5 space-y-5 pb-32">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  {!useCustomDate ? (
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomDate(true);
                        setInputDate(formatInputDate());
                      }}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span>
                        <span className="block text-xs font-black text-slate-500">
                          fecha automática
                        </span>
                        <span className="block text-xs font-bold text-slate-400">
                          se registrará con la fecha y hora actual
                        </span>
                      </span>

                      <span className="text-xs font-black text-[#6a1b9a]">
                        cambiar fecha
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400 shrink-0" />

                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          fecha personalizada
                        </label>

                        <input
                          type="datetime-local"
                          value={inputDate}
                          max={formatInputDate()}
                          onChange={(event) => setInputDate(event.target.value)}
                          className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none no-lowercase"
                          required
                        />
                      </div>

                      {!initialData && (
                        <button
                          type="button"
                          onClick={() => {
                            setUseCustomDate(false);
                            setInputDate(formatInputDate());
                          }}
                          className="text-xs font-black text-slate-400 hover:text-rose-500"
                        >
                          quitar
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isTransfer ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                      <p className="text-xs font-black text-rose-600 mb-3">
                        origen · sale de
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={fromBrand}
                          onChange={(event) =>
                            setFromBrand(event.target.value)
                          }
                          className="w-full p-3 bg-white border border-rose-100 rounded-xl text-sm font-bold outline-none"
                        >
                          {brandNames.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        <select
                          value={fromMethod}
                          onChange={(event) =>
                            setFromMethod(event.target.value)
                          }
                          className="w-full p-3 bg-white border border-rose-100 rounded-xl text-sm font-bold outline-none"
                        >
                          {methodNames.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="text-xs font-black text-emerald-600 mb-3">
                        destino · entra a
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={toBrand}
                          onChange={(event) => setToBrand(event.target.value)}
                          className="w-full p-3 bg-white border border-emerald-100 rounded-xl text-sm font-bold outline-none"
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
                          className="w-full p-3 bg-white border border-emerald-100 rounded-xl text-sm font-bold outline-none"
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
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl no-lowercase">
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
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 no-lowercase"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-2">
                          empresa
                        </label>

                        <select
                          value={brand}
                          onChange={(event) => setBrand(event.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white"
                        >
                          {brandNames.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-2">
                          categoría
                        </label>

                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white"
                        >
                          {(isIncome ? incomeCats : expenseCats).map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black text-slate-500">
                          medios de pago
                        </label>

                        <span className="text-xs font-bold text-slate-400">
                          dividir pago
                        </span>
                      </div>

                      <div className="space-y-2">
                        {splits.map((split, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <select
                              value={split.method}
                              onChange={(event) => {
                                const nextSplits = [...splits];
                                nextSplits[index].method = event.target.value;
                                setSplits(nextSplits);
                              }}
                              className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
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
                              onChange={(event) => {
                                const nextSplits = [...splits];
                                nextSplits[index].amount = event.target.value;
                                setSplits(nextSplits);
                              }}
                              placeholder="0.00"
                              className="w-28 p-3 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none no-lowercase"
                              required={splits.length === 1}
                            />

                            {splits.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSplits(
                                    splits.filter(
                                      (_, splitIndex) => splitIndex !== index
                                    )
                                  )
                                }
                                className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 rounded-xl"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSplits([
                            ...splits,
                            { method: methodNames[0] || "", amount: "" },
                          ])
                        }
                        className="mt-3 w-full py-3 text-sm font-black text-slate-500 bg-white border border-slate-200 border-dashed hover:border-[#6a1b9a] hover:text-[#6a1b9a] rounded-xl transition-colors"
                      >
                        <Plus size={15} className="inline mr-1" />
                        agregar método
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">
                    nota opcional
                  </label>

                  <input
                    type="text"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="detalle de la operación..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase">
                      total a registrar
                    </p>

                    <p className="text-xs font-bold text-slate-500">
                      {isTransfer
                        ? `${fromBrand} → ${toBrand}`
                        : `${brand} · ${category}`}
                    </p>
                  </div>

                  <strong
                    className={`text-2xl font-black no-lowercase ${
                      isIncome
                        ? "text-emerald-600"
                        : isExpense
                          ? "text-rose-600"
                          : "text-blue-600"
                    }`}
                  >
                    {FORMATTER.format(
                      isTransfer
                        ? parseFloat(transferAmount) || 0
                        : currentTotal
                    )}
                  </strong>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 text-white text-base font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                    isTransfer
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                      : isIncome
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                        : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
                  }`}
                >
                  {actionLabel}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}