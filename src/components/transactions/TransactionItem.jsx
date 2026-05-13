import { useState } from "react";

import {
  ArrowRightLeft,
  Edit2,
  FileText,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function TransactionItem({
  txn,
  onDelete,
  onEdit,
  settings,
  iconGallery,
  formatter,
  dateFormatter,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const isTransfer = txn.type === "transferencia";
  const isIncome = txn.type === "ingreso";

  let displayIcon = isTransfer
    ? ArrowRightLeft
    : isIncome
      ? TrendingUp
      : TrendingDown;

  let displayColor = isTransfer
    ? "bg-blue-50 text-blue-600"
    : isIncome
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  if (!isTransfer && settings) {
    const catList = isIncome
      ? settings.categories.ingreso
      : settings.categories.gasto;

    const catDef = catList.find(
      (category) => category.name === txn.category
    );

    if (catDef) {
      displayIcon = iconGallery[catDef.icon] || displayIcon;
      displayColor = `${catDef.color} bg-opacity-10 text-slate-800`;
    }
  }

  const IconComponent = displayIcon;

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-3 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 w-[65%] sm:w-3/4">
          <div
            className={`p-3 shrink-0 rounded-2xl ${displayColor} ${
              !displayColor.includes("text-") ? "text-white" : ""
            }`}
          >
            <IconComponent size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {isTransfer ? "transferencia interna" : txn.category}
            </p>

            <div className="flex flex-wrap items-center text-xs text-slate-500 mt-1 gap-1.5">
              {isTransfer ? (
                <>
                  <span className="text-rose-500 font-medium">
                    {txn.fromBrand}
                  </span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-medium">
                    {txn.toBrand}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-700">
                    {txn.brand}
                  </span>
                  <span>•</span>
                  <span>
                    {dateFormatter.format(new Date(txn.createdAt))}
                  </span>
                </>
              )}
            </div>

            {!isTransfer && txn.splits && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {txn.splits.map((split, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md"
                  >
                    {split.method}: s/
                    {parseFloat(split.amount).toFixed(0)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 ml-2">
          <div
            className={`font-bold text-base no-lowercase ${
              isTransfer
                ? "text-blue-600"
                : isIncome
                  ? "text-emerald-600"
                  : "text-slate-800"
            }`}
          >
            {isIncome ? "+" : isTransfer ? "" : "-"}
            {formatter.format(txn.amount)}
          </div>

          <div className="mt-2 h-6 flex items-center justify-end space-x-1">
            {isDeleting ? (
              <div className="flex space-x-1 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="text-[10px] px-2 py-1 bg-slate-200 rounded font-bold"
                >
                  cancelar
                </button>

                <button
                  onClick={() => onDelete(txn.id)}
                  className="text-[10px] px-2 py-1 bg-rose-500 text-white rounded font-bold"
                >
                  borrar
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onEdit(txn)}
                  className="text-slate-300 hover:text-blue-500 p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="editar"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => setIsDeleting(true)}
                  className="text-slate-300 hover:text-rose-500 p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {txn.note && (
        <div className="mt-3 pl-[56px] text-xs text-slate-500 italic flex items-start">
          <FileText
            size={12}
            className="mr-1.5 mt-0.5 shrink-0 opacity-50"
          />

          <span className="line-clamp-2">{txn.note}</span>
        </div>
      )}
    </div>
  );
}