export const DEFAULT_SETTINGS = {
  brands: [
    {
      id: "b1",
      name: "wooly",
      icon: "store",
      color: "bg-blue-500",
    },
    {
      id: "b2",
      name: "gleemour",
      icon: "star",
      color: "bg-emerald-500",
    },
    {
      id: "b3",
      name: "jung inversiones",
      icon: "briefcase",
      color: "bg-indigo-500",
    },
    {
      id: "b4",
      name: "otra",
      icon: "component",
      color: "bg-slate-700",
    },
  ],

  categories: {
    ingreso: [
      {
        id: "i1",
        name: "ventas",
        icon: "shopping_cart",
        color: "bg-emerald-500",
      },
      {
        id: "i2",
        name: "servicios",
        icon: "briefcase",
        color: "bg-blue-500",
      },
      {
        id: "i3",
        name: "rendimientos",
        icon: "zap",
        color: "bg-amber-500",
      },
      {
        id: "i4",
        name: "aporte capital",
        icon: "banknote",
        color: "bg-indigo-500",
      },
      {
        id: "i5",
        name: "otros ingresos",
        icon: "plus",
        color: "bg-slate-700",
      },
    ],

    gasto: [
      {
        id: "g1",
        name: "marketing",
        icon: "monitor",
        color: "bg-rose-500",
      },
      {
        id: "g2",
        name: "planilla",
        icon: "smile",
        color: "bg-[#6a1b9a]",
      },
      {
        id: "g3",
        name: "inventario",
        icon: "truck",
        color: "bg-amber-500",
      },
      {
        id: "g4",
        name: "suscripciones",
        icon: "laptop",
        color: "bg-blue-500",
      },
      {
        id: "g5",
        name: "impuestos",
        icon: "shield",
        color: "bg-rose-600",
      },
      {
        id: "g6",
        name: "operativa",
        icon: "coffee",
        color: "bg-slate-700",
      },
      {
        id: "g7",
        name: "otros gastos",
        icon: "component",
        color: "bg-slate-700",
      },
    ],
  },

  methods: [
    {
      id: "m1",
      name: "transferencia (bcp)",
      type: "bcp",
      icon: "briefcase",
      color: "bg-blue-500",
    },
    {
      id: "m2",
      name: "transferencia (ibk)",
      type: "bcp",
      icon: "briefcase",
      color: "bg-emerald-500",
    },
    {
      id: "m3",
      name: "yape",
      type: "yape",
      icon: "smartphone",
      color: "bg-[#6a1b9a]",
    },
    {
      id: "m4",
      name: "plin",
      type: "yape",
      icon: "smartphone",
      color: "bg-rose-500",
    },
    {
      id: "m5",
      name: "efectivo",
      type: "cash",
      icon: "banknote",
      color: "bg-emerald-600",
    },
    {
      id: "m6",
      name: "tarjeta crédito",
      type: "bcp",
      icon: "store",
      color: "bg-amber-500",
    },
    {
      id: "m7",
      name: "pasarela (stripe)",
      type: "bcp",
      icon: "globe",
      color: "bg-indigo-500",
    },
  ],
};