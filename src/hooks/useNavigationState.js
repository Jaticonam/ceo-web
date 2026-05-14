import { useState } from "react";

export default function useNavigationState() {
  const [currentTab, setCurrentTab] =
    useState("inicio");

  return {
    currentTab,
    setCurrentTab,
  };
}