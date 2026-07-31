"use client";

import React, { useEffect } from "react";
import { useMaintenance } from "@/context/MaintenanceContext";
import { AlertTriangle, Clock } from "lucide-react";

export default function MaintenanceModal() {
  const { isMaintenance, setMaintenance } = useMaintenance();

  useEffect(() => {
    const handleGlobalMaintenance = () => setMaintenance(true);
    
    window.addEventListener("trigger-maintenance-modal", handleGlobalMaintenance);
    return () => {
      window.removeEventListener("trigger-maintenance-modal", handleGlobalMaintenance);
    };
  }, [setMaintenance]);

  if (!isMaintenance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#181532] border border-violet-500/30 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
        
        {/* Destello decorativo */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Servicio en Mantenimiento
        </h3>
        
        <p className="text-neutral-300 text-xs sm:text-sm mb-6 leading-relaxed">
          Nuestros proveedores principales se encuentran experimentando incidencias técnicas temporales. Estamos trabajando para restablecer la conexión y garantizar una experiencia fluida sin interrupciones.
        </p>

        <div className="flex items-center justify-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-wider bg-violet-950/40 border border-violet-500/20 py-2.5 rounded-xl">
          <Clock size={14} />
          <span>Vuelve más tarde</span>
        </div>

      </div>
    </div>
  );
}