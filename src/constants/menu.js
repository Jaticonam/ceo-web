import {
  Activity,
  BarChart3,
  Building2,
  Home,
  PieChart,
  Settings,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "inicio",
    label: "inicio",
    icon: Home,
  },
  {
    id: "historial",
    label: "movs",
    icon: Activity,
  },
  {
    id: "nuevo",
    label: "nuevo",
    icon: Home,
  },
  {
    id: "empresas",
    label: "marcas",
    icon: Building2,
  },
  {
    id: "informes",
    label: "stats",
    icon: BarChart3,
  },
];

export const DESKTOP_MENU_ITEMS = [
  {
    id: "inicio",
    label: "inicio",
    icon: Home,
  },
  {
    id: "historial",
    label: "historial",
    icon: Activity,
  },
  {
    id: "empresas",
    label: "empresas",
    icon: Building2,
  },
  {
    id: "informes",
    label: "informes",
    icon: BarChart3,
  },
  {
    id: "presupuestos",
    label: "presupuestos",
    icon: PieChart,
  },
];