"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MaintenanceContextType {
  isMaintenance: boolean;
  setMaintenance: (status: boolean) => void;
  apiName: string;
  setApiName: (name: string) => void;
  triggerMaintenance: (name?: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isMaintenance, setMaintenance] = useState(false);
  const [apiName, setApiName] = useState("MangaDex / AniList");

  // Función útil para activar el modal rápidamente desde cualquier lado
  const triggerMaintenance = (name: string = "MangaDex / AniList") => {
    setApiName(name);
    setMaintenance(true);
  };

  return (
    <MaintenanceContext.Provider value={{ isMaintenance, setMaintenance, apiName, setApiName, triggerMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance debe usarse dentro de un MaintenanceProvider");
  }
  return context;
}