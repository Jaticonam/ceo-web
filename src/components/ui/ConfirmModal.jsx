import { X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "confirmar",
  cancelText = "cancelar",
  tone = "primary",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const buttonClass =
    tone === "danger"
      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
      : "bg-[#6a1b9a] hover:bg-purple-800 shadow-purple-500/30";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl font-black text-slate-800">
              {title}
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-slate-50 p-2 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}