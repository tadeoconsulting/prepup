import React, { useState } from "react";
import { UserPlan, LatinCountry, PreparationDuration } from "../types";
import { LATIN_EXAM_PRESETS } from "../data/presetProfiles";
import { Settings, GraduationCap, Calendar, Clock, ArrowRight, CheckCircle2, Download, Server, HardDrive } from "lucide-react";

interface PlanSetupWizardProps {
  currentPlan: UserPlan;
  onSavePlan: (updatedPlan: UserPlan) => void;
  onClose?: () => void;
}

export const PlanSetupWizard: React.FC<PlanSetupWizardProps> = ({
  currentPlan,
  onSavePlan,
  onClose,
}) => {
  const [studentName, setStudentName] = useState(currentPlan.studentName);
  const [targetPresetId, setTargetPresetId] = useState("unam_mx");
  const [targetCareer, setTargetCareer] = useState(currentPlan.targetCareer);
  const [durationMonths, setDurationMonths] = useState<PreparationDuration>(currentPlan.durationMonths);
  const [dailyHours, setDailyHours] = useState(currentPlan.dailyStudyHoursGoal);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const response = await fetch("/api/download-source");
      if (!response.ok) {
        throw new Error("No se pudo obtener el archivo ZIP");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "proyecto-completo.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Hubo un error al intentar descargar el código fuente.");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPreset = LATIN_EXAM_PRESETS.find((p) => p.id === targetPresetId) || LATIN_EXAM_PRESETS[0];

    const updated: UserPlan = {
      ...currentPlan,
      studentName: studentName || "Estudiante",
      targetCountry: selectedPreset.country,
      targetUniversity: selectedPreset.universityName,
      targetExamName: selectedPreset.examName,
      targetCareer: targetCareer || "Ingeniería / Medicina",
      durationMonths: durationMonths,
      dailyStudyHoursGoal: Number(dailyHours) || 3,
      examDate: new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    onSavePlan(updated);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white border-b-4 border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-2xl w-full text-[#2D3436] space-y-4 sm:space-y-6 shadow-xl mx-auto my-auto max-h-[90vh] overflow-y-auto relative">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 pr-8 sm:pr-0">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="p-2.5 sm:p-3 bg-[#EBF3FF] border-2 border-[#4D96FF] rounded-2xl text-[#4D96FF] shrink-0">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-[#2D3436]">Configurar Plan de Preparación</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">Personaliza la universidad de destino y duración del plan</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Student Name & Career */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Nombre del Estudiante</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Carrera Profesional Deseada</label>
            <input
              type="text"
              required
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              placeholder="Ej. Medicina Humana, Ing. de Sistemas, Derecho"
              className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] placeholder-slate-400 font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
            />
          </div>
        </div>

        {/* Target Exam Profile selection */}
        <div>
          <label className="block text-slate-500 font-bold mb-1">
            Universidad / Modelo de Examen objetivo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {LATIN_EXAM_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => setTargetPresetId(preset.id)}
                className={`px-3.5 py-2.5 rounded-2xl border-2 text-left transition-all flex items-start justify-between cursor-pointer min-h-[44px] ${
                  targetPresetId === preset.id
                    ? "bg-[#EBF3FF] border-[#4D96FF] text-[#4D96FF] font-black shadow-xs"
                    : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                }`}
              >
                <div>
                  <div className="font-extrabold flex items-center gap-1.5 text-xs text-[#2D3436]">
                    <span>{preset.countryFlag}</span>
                    <span>{preset.universityName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-bold mt-0.5">{preset.examName}</div>
                </div>
                {targetPresetId === preset.id && <CheckCircle2 className="w-4 h-4 text-[#4D96FF] shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Preparation Duration Options: 2, 3, 6, 9, 12 months */}
        <div>
          <label className="block text-slate-500 font-bold mb-1">
            Tiempo de Preparación (Duración del Plan)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {([2, 3, 6, 9, 12] as PreparationDuration[]).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setDurationMonths(m)}
                className={`px-3 py-2 rounded-2xl border-2 text-center font-black text-xs transition-all cursor-pointer min-h-[40px] ${
                  durationMonths === m
                    ? "bg-[#4D96FF] border-blue-600 text-white shadow-md"
                    : "bg-[#F8FAFC] border-slate-100 text-slate-600 hover:border-slate-300"
                }`}
              >
                {m} M
              </button>
            ))}
          </div>
        </div>

        {/* Daily Study Goal Hours */}
        <div>
          <label className="block text-slate-500 font-bold mb-1">
            Meta Diaria de Horas de Estudio
          </label>
          <select
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
          >
            <option value={2}>2 Horas al día (Compaginado con Colegio)</option>
            <option value={3}>3 Horas al día (Estándar Preuniversitario)</option>
            <option value={4}>4 Horas al día (Intensivo)</option>
            <option value={6}>6 Horas al día (Súper Intensivo)</option>
          </select>
        </div>

        {/* Local Hosting & Download Section */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Alojar Localmente / Descargar Proyecto (.zip)</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
            Puedes descargar todo el código fuente de la aplicación en un archivo comprimido `.zip` para ejecutarlo localmente en tu computadora con Node.js (`npm run dev`) o desplegarlo en tu servidor privado.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              <Download className={`w-4 h-4 ${isDownloadingZip ? "animate-bounce" : ""}`} />
              <span>{isDownloadingZip ? "Generando y Descargando ZIP..." : "Descargar Código Fuente Completo (.zip)"}</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer min-h-[40px]"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white rounded-xl font-black shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer uppercase tracking-wider text-xs min-h-[40px]"
          >
            <span>Guardar y Aplicar Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
