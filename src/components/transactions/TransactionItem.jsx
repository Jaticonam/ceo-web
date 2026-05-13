import { useState } from "react";
import {
  ArrowRightLeft,
  Edit2,
  FileText,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { ICON_GALLERY } from "../../constants/icons";
import { DATE_FORMATTER, FORMATTER } from "../../utils/formatters";

export default function TransactionItem({
  txn,
  onDelete,
  onEdit,
  settings,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const isTransfer = txn.type === "transferencia";
  const isIncome = txn.type === "ingreso";

  let DisplayIcon = isTransfer
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
    const categoryList = isIncome
      ? settings.categories.ingreso
      : settings.categories.gasto;

    const categoryDefinition = categoryList.find(
      (category) => category.name === txn.category
    );

    if (categoryDefinition) {
      DisplayIcon =
        ICON_GALLERY[categoryDefinition.icon] || Store;

      displayColor = `${categoryDefinition.color} bg-opacity-10 text-slate-800`;
    }
  }

  return (
    <div className="group mb-3 flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex w-[65%] items-center space-x-4 sm:w-3/4">
          <div
            className={`shrink-0 rounded-2xl p-3 ${displayColor}`}
          >
            <DisplayIcon size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {isTransfer ? "transferencia interna" : txn.category}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              {isTransfer ? (
                <>
                  <span className="font-medium text-rose-500">
                    {txn.fromBrand}
                  </span>
                  <span>➔</span>
                  <span className="font-medium text-emerald-500">
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
                    {DATE_FORMATTER.format(new Date(txn.createdAt))}
                  </span>
                </>
              )}
            </div>

            {!isTransfer && txn.splits && (
              <div className="mt-2 flex flex-wrap gap-1">
                {txn.splits.map((split, index) => (
                  <span
                    key={`${split.method}-${index}`}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600"
                  >
                    {split.method}: s/
                    {Number(split.amount || 0).toFixed(0)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ml-2 flex shrink-0 flex-col items-end">
          <div
            className={`text-base font-bold ${
              isTransfer
                ? "text-blue-600"
                : isIncome
                  ? "text-emerald-600"
                  : "text-slate-800"
            }`}
          >
            {isIncome ? "+" : isTransfer ? "" : "-"}
            {FORMATTER.format(txn.amount)}
          </div>

          <div className="mt-2 flex h-6 items-center justify-end space-x-1">
            {isDeleting ? (
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold"
                >
                  cancelar
                </button>

                <button
                  onClick={() => onDelete(txn.id)}
                  className="rounded bg-rose-500 px-2 py-1 text-[10px] font-bold text-white"
                >
                  borrar
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onEdit(txn)}
                  className="p-1 text-slate-300 transition-opacity hover:text-blue-500 md:opacity-0 md:group-hover:opacity-100"
                  title="editar"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => setIsDeleting(true)}
                  className="p-1 text-slate-300 transition-opacity hover:text-rose-500 md:opacity-0 md:group-hover:opacity-100"
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
        <div className="mt-3 flex items-start pl-[56px] text-xs italic text-slate-500">
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