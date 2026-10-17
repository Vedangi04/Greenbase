import { createContext, useContext, useState, useEffect } from "react";
import { calcFines, calcLimits } from "@/lib/nycOpenData";

const BuildingContext = createContext({ building: null, selectBuilding: () => {} });

/** Ensure a building object has all compliance fields populated */
export function enrichBuilding(b) {
  if (!b) return null;
  // If already enriched (has fine2024 set), return as-is
  if (b.fine2024 !== undefined && b.cap2024 !== undefined) return b;
  const type = (b.type || "office").toLowerCase();
  const limits = calcLimits(b.sqft, type);
  const fines = calcFines(b.currentEmissions, b.sqft, type);
  return { ...b, ...limits, ...fines };
}

export function BuildingProvider({ children }) {
  const [building, setBuilding] = useState(() => {
    try {
      const raw = localStorage.getItem("greenbase_selected");
      return raw ? enrichBuilding(JSON.parse(raw)) : null;
    } catch { return null; }
  });

  const selectBuilding = (b) => {
    const enriched = enrichBuilding(b);
    setBuilding(enriched);
    localStorage.setItem("greenbase_selected", JSON.stringify(enriched));
    // Also keep sessionStorage keys for legacy compat
    if (enriched?.id === "manual") {
      sessionStorage.setItem("greenbase_manual_building", JSON.stringify(enriched));
    } else if (enriched?.id) {
      sessionStorage.setItem("greenbase_live_building", JSON.stringify(enriched));
    }
  };

  return (
    <BuildingContext.Provider value={{ building, selectBuilding }}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuilding() {
  return useContext(BuildingContext);
}
