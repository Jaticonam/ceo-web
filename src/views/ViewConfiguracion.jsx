import { useMemo, useState } from "react";
import { Edit2, Plus, Store, Trash2 } from "lucide-react";

import ConfirmModal from "../components/ui/ConfirmModal";
import ConfigFormModal from "../components/settings/ConfigFormModal";
import { useToast } from "../context/ToastContext";

const TABS = [
  { id: "empresas", label: "empresas" },
  { id: "ingresos", label: "ingresos" },
  { id: "gastos", label: "gastos" },
  { id: "metodos", label: "métodos" },
];

function normalizeName(value) {
  return value.trim().toLowerCase();
}

export default function ViewConfiguracion({
  settings,
  setSettings,
  iconGallery,
}) {
  const [subTab, setSubTab] = useState("empresas");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("store");
  const [color, setColor] = useState("bg-blue-500");
  const [methodType, setMethodType] = useState("bcp");
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const { showToast } = useToast();

  const listToRender = useMemo(() => {
    if (subTab === "empresas") return settings.brands;
    if (subTab === "ingresos") return settings.categories.ingreso;
    if (subTab === "gastos") return settings.categories.gasto;
    return settings.methods;
  }, [subTab, settings]);

  const activeLabel = TABS.find((tab) => tab.id === subTab)?.label || subTab;

  const resetForm = () => {
    setName("");
    setIcon("store");
    setColor("bg-blue-500");
    setMethodType("bcp");
    setEditingId(null);
    setError("");
    setFormMode("create");
  };

  const openCreateModal = () => {
    resetForm();
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setIcon(item.icon || "store");
    setColor(item.color || "bg-blue-500");
    setMethodType(item.type || "bcp");
    setFormMode("edit");
    setError("");
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const buildNextSettings = () => ({
    ...settings,
    brands: [...settings.brands],
    categories: {
      ingreso: [...settings.categories.ingreso],
      gasto: [...settings.categories.gasto],
    },
    methods: [...settings.methods],
  });

  const getTargetList = (nextSettings) => {
    if (subTab === "empresas") return nextSettings.brands;
    if (subTab === "ingresos") return nextSettings.categories.ingreso;
    if (subTab === "gastos") return nextSettings.categories.gasto;
    return nextSettings.methods;
  };

  const replaceTargetList = (nextSettings, nextList) => {
    if (subTab === "empresas") nextSettings.brands = nextList;
    if (subTab === "ingresos") nextSettings.categories.ingreso = nextList;
    if (subTab === "gastos") nextSettings.categories.gasto = nextList;
    if (subTab === "metodos") nextSettings.methods = nextList;
  };

  const saveItem = () => {
    const cleanName = normalizeName(name);
    const nextSettings = buildNextSettings();
    const currentList = getTargetList(nextSettings);

    if (editingId) {
      replaceTargetList(
        nextSettings,
        currentList.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                icon,
                color,
                ...(subTab === "metodos" ? { type: methodType } : {}),
              }
            : item
        )
      );

      setSettings(nextSettings);
      showToast({ title: "registro actualizado" });
      closeFormModal();
      return;
    }

    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: cleanName,
      icon,
      color,
      ...(subTab === "metodos" ? { type: methodType } : {}),
    };

    replaceTargetList(nextSettings, [...currentList, newItem]);
    setSettings(nextSettings);
    showToast({ title: "registro creado" });
    closeFormModal();
  };

  const requestSave = () => {
    const cleanName = normalizeName(name);

    if (!cleanName) {
      setError("escribe un nombre.");
      return;
    }

    const exists = listToRender.some(
      (item) => item.name === cleanName && item.id !== editingId
    );

    if (exists) {
      setError("ese nombre ya existe.");
      return;
    }

    setError("");
    setConfirmAction({
      title: editingId ? "guardar cambios" : "crear registro",
      message: editingId
        ? `¿guardar cambios en "${cleanName}"?`
        : `¿crear "${cleanName}" en ${subTab}?`,
      confirmText: editingId ? "guardar cambios" : "crear",
      tone: "primary",
      onConfirm: saveItem,
    });
  };

  const handleDelete = (item) => {
    if (listToRender.length <= 1) {
      showToast({
        title: "debe quedar al menos un registro",
        type: "error",
      });
      return;
    }

    setConfirmAction({
      title: "eliminar registro",
      message: `¿seguro que quieres eliminar "${item.name}"? esta acción no se puede deshacer.`,
      confirmText: "eliminar",
      tone: "danger",
      onConfirm: () => {
        const nextSettings = buildNextSettings();
        const currentList = getTargetList(nextSettings);
        const updatedList = currentList.filter(
          (current) => current.id !== item.id
        );

        replaceTargetList(nextSettings, updatedList);
        setSettings(nextSettings);
        showToast({ title: "registro eliminado" });
      },
    });
  };

  const closeConfirm = () => setConfirmAction(null);

  const confirmAndClose = () => {
    confirmAction?.onConfirm?.();
    closeConfirm();
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id);
                resetForm();
              }}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                subTab === tab.id
                  ? "bg-[#6a1b9a] text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              {activeLabel}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {listToRender.length} registros configurados
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6a1b9a] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:bg-purple-800 transition-all"
          >
            <Plus size={18} />
            nuevo
          </button>
        </section>

        {listToRender.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-black text-slate-700">
              todavía no hay registros
            </p>
            <p className="text-sm font-bold text-slate-400 mt-2">
              crea el primero para iniciar la configuración
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listToRender.map((item) => {
              const Icon = iconGallery[item.icon] || Store;

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-xl ${item.color} text-white`}>
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 capitalize truncate">
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

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="text-slate-300 hover:text-blue-500 p-2"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-slate-300 hover:text-rose-500 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfigFormModal
        isOpen={isFormOpen}
        mode={formMode}
        subTab={subTab}
        name={name}
        setName={setName}
        icon={icon}
        setIcon={setIcon}
        color={color}
        setColor={setColor}
        methodType={methodType}
        setMethodType={setMethodType}
        error={error}
        iconGallery={iconGallery}
        onSave={requestSave}
        onClose={closeFormModal}
      />

      <ConfirmModal
        isOpen={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        tone={confirmAction?.tone}
        onConfirm={confirmAndClose}
        onCancel={closeConfirm}
      />
    </>
  );
}