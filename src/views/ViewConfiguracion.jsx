import { useState } from "react";
import { Store, Trash2 } from "lucide-react";

import Card from "../components/ui/Card";

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

export default function ViewConfiguracion({
  settings,
  setSettings,
  iconGallery,
}) {
  const [subTab, setSubTab] = useState("empresas");
  const [newItemName, setNewItemName] = useState("");
  const [newItemIcon, setNewItemIcon] = useState("store");
  const [newItemColor, setNewItemColor] = useState("bg-blue-500");
  const [newItemType, setNewItemType] = useState("bcp");

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
      name: newItemName.trim().toLowerCase(),
      icon: newItemIcon,
      color: newItemColor,
    };

    const newSettings = {
      ...settings,
      brands: [...settings.brands],
      categories: {
        ingreso: [...settings.categories.ingreso],
        gasto: [...settings.categories.gasto],
      },
      methods: [...settings.methods],
    };

    if (subTab === "empresas") {
      newSettings.brands.push(newItem);
    }

    if (subTab === "ingresos") {
      newSettings.categories.ingreso.push(newItem);
    }

    if (subTab === "gastos") {
      newSettings.categories.gasto.push(newItem);
    }

    if (subTab === "metodos") {
      newSettings.methods.push({
        ...newItem,
        type: newItemType,
      });
    }

    setSettings(newSettings);
    setNewItemName("");
  };

  const handleDeleteItem = (id) => {
    const newSettings = {
      ...settings,
      brands: [...settings.brands],
      categories: {
        ingreso: [...settings.categories.ingreso],
        gasto: [...settings.categories.gasto],
      },
      methods: [...settings.methods],
    };

    if (subTab === "empresas") {
      newSettings.brands = newSettings.brands.filter(
        (item) => item.id !== id
      );
    }

    if (subTab === "ingresos") {
      newSettings.categories.ingreso =
        newSettings.categories.ingreso.filter(
          (item) => item.id !== id
        );
    }

    if (subTab === "gastos") {
      newSettings.categories.gasto =
        newSettings.categories.gasto.filter(
          (item) => item.id !== id
        );
    }

    if (subTab === "metodos") {
      newSettings.methods = newSettings.methods.filter(
        (item) => item.id !== id
      );
    }

    setSettings(newSettings);
  };

  const listToRender =
    subTab === "empresas"
      ? settings.brands
      : subTab === "ingresos"
        ? settings.categories.ingreso
        : subTab === "gastos"
          ? settings.categories.gasto
          : settings.methods;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto">
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto scrollbar-hide">
        {["empresas", "ingresos", "gastos", "metodos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl capitalize transition-all whitespace-nowrap ${
              subTab === tab
                ? "bg-[#6a1b9a] text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card className="bg-slate-50/50 border-dashed border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          crear nuevo registro
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">
                nombre
              </label>

              <input
                type="text"
                value={newItemName}
                onChange={(event) =>
                  setNewItemName(event.target.value)
                }
                placeholder={`ej. ${
                  subTab === "metodos" ? "paypal" : "nueva marca"
                }`}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#6a1b9a]"
              />
            </div>

            {subTab === "metodos" && (
              <div className="w-1/3">
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  clasificación financiera
                </label>

                <select
                  value={newItemType}
                  onChange={(event) =>
                    setNewItemType(event.target.value)
                  }
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#6a1b9a]"
                >
                  <option value="bcp">bancos (digital)</option>
                  <option value="cash">efectivo (físico)</option>
                  <option value="yape">billeteras (yape/plin)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">
              elige un icono
            </label>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Object.keys(iconGallery).map((iconKey) => {
                const Icon = iconGallery[iconKey] || Store;

                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setNewItemIcon(iconKey)}
                    className={`p-3 rounded-xl border flex-shrink-0 transition-all ${
                      newItemIcon === iconKey
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
              elige un color
            </label>

            <div className="flex gap-3">
              {COLOR_GALLERY.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewItemColor(color)}
                  className={`w-8 h-8 rounded-full ${color} ${
                    newItemColor === color
                      ? "ring-4 ring-offset-2 ring-slate-300"
                      : ""
                  } transition-all`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            className="mt-4 px-6 py-3 bg-[#6a1b9a] text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 transition-colors"
          >
            guardar {subTab}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listToRender.map((item) => {
          const Icon = iconGallery[item.icon] || Store;

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl ${item.color} text-white`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">
                    {item.name}
                  </p>

                  {item.type && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {item.type === "bcp"
                        ? "bancos"
                        : item.type === "cash"
                          ? "efectivo"
                          : "billeteras"}
                    </p>
                  )}
                </div>
              </div>

              {listToRender.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}