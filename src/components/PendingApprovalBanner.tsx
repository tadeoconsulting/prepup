import React from "react";
import { Clock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface PendingApprovalBannerProps {
  studentName: string;
  targetUniversity: string;
  onSimulateApproval: () => void;
}

export const PendingApprovalBanner: React.FC<PendingApprovalBannerProps> = ({
  studentName,
  targetUniversity,
  onSimulateApproval,
}) => {
  return (
    <div className="bg-amber-500/10 border-2 border-amber-400 rounded-3xl p-5 shadow-md mb-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 rounded-full">
                Acceso Controlado
              </span>
              <span className="text-xs font-bold text-amber-800">
                Estado: Pendiente de Aprobación
              </span>
            </div>
            <h2 className="text-base font-black text-amber-950 mt-1">
              Hola {studentName}, tu cuenta para {targetUniversity} está en revisión
            </h2>
            <p className="text-xs text-amber-900/80 mt-0.5 max-w-xl font-medium">
              El administrador del sistema debe activar tu usuario para habilitar el envío oficial de simulacros y la descarga de reportes.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onSimulateApproval}
          className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Aprobar mi Cuenta (Demostración)</span>
        </button>
      </div>
    </div>
  );
};
