import { Save, Store, X } from "lucide-react";

const COLOR_GALLERY = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-[#6a1b9a]",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-slate-700",
];

export default function ConfigFormModal({
  isOpen,
  mode,
  subTab,
  name,
  setName,
  icon,
  setIcon,
  color,
  setColor,
  methodType,
  setMethodType,
  error,
  iconGallery,
  onSave,
  onClose,
}) {
  if (!isOpen) return null;

  const isEditing = mode === "edit";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800">
              {isEditing ? "editar registro" : "crear nuevo registro"}
            </h3>

            <p className="text-sm font-bold text-slate-400 mt-1">
              {subTab}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">
              nombre
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={
                subTab === "metodos"
                  ? "ej. paypal"
                  : subTab === "empresas"
                    ? "ej. nueva marca"
                    : "ej. nueva categoría"
              }
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#6a1b9a]"
            />
          </div>

          {subTab === "metodos" && (
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-2">
                tipo financiero
              </label>

              <select
                value={methodType}
                onChange={(event) => setMethodType(event.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#6a1b9a]"
              >
                <option value="bcp">bancos / digital</option>
                <option value="cash">efectivo físico</option>
                <option value="yape">billeteras</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">
              icono
            </label>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Object.keys(iconGallery).map((iconKey) => {
                const Icon = iconGallery[iconKey] || Store;

                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setIcon(iconKey)}
                    className={`p-3 rounded-xl border flex-shrink-0 transition-all ${
                      icon === iconKey
                        ? "bg-white border-[#6a1b9a] text-[#6a1b9a] shadow-sm"
                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">
              color
            </label>

            <div className="flex gap-3">
              {COLOR_GALLERY.map((itemColor) => (
                <button
                  key={itemColor}
                  type="button"
                  onClick={() => setColor(itemColor)}
                  className={`w-9 h-9 rounded-full ${itemColor} ${
                    color === itemColor
                      ? "ring-4 ring-offset-2 ring-slate-300"
                      : ""
                  } transition-all`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm font-bold text-rose-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              cancelar
            </button>

            <button
              type="button"
              onClick={onSave}
              className="px-6 py-3 bg-[#6a1b9a] text-white text-sm font-bold rounded-xl shadow-md hover:bg-purple-800 transition-colors inline-flex items-center gap-2"
            >
              <Save size={16} />
              {isEditing ? "guardar cambios" : "crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}