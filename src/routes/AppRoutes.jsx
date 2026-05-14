import ViewInicio from "../views/ViewInicio";
import ViewEmpresas from "../views/ViewEmpresas";
import ViewHistorial from "../views/ViewHistorial";
import ViewPresupuestos from "../views/ViewPresupuestos";
import ViewInformes from "../views/ViewInformes";
import ViewConfiguracion from "../views/ViewConfiguracion";

export const ROUTES = [
  {
    path: "/",
    id: "inicio",
    label: "inicio",
    element: ViewInicio,
  },
  {
    path: "/empresas",
    id: "empresas",
    label: "empresas",
    element: ViewEmpresas,
  },
  {
    path: "/historial",
    id: "historial",
    label: "historial",
    element: ViewHistorial,
  },
  {
    path: "/presupuestos",
    id: "presupuestos",
    label: "presupuestos",
    element: ViewPresupuestos,
  },
  {
    path: "/informes",
    id: "informes",
    label: "informes",
    element: ViewInformes,
  },
  {
    path: "/configuracion",
    id: "configuracion",
    label: "configuracion",
    element: ViewConfiguracion,
  },
];