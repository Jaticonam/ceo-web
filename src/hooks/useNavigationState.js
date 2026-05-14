import { useLocation, useNavigate } from "react-router-dom";

const TAB_BY_PATH = {
  "/": "inicio",
  "/empresas": "empresas",
  "/historial": "historial",
  "/presupuestos": "presupuestos",
  "/informes": "informes",
  "/configuracion": "configuracion",
};

const PATH_BY_TAB = {
  inicio: "/",
  empresas: "/empresas",
  historial: "/historial",
  presupuestos: "/presupuestos",
  informes: "/informes",
  configuracion: "/configuracion",
};

export default function useNavigationState() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = TAB_BY_PATH[location.pathname] || "inicio";

  const setCurrentTab = (tabId) => {
    const path = PATH_BY_TAB[tabId] || "/";
    navigate(path);
  };

  return {
    currentTab,
    setCurrentTab,
  };
}