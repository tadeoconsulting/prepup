import React, { useState } from "react";
import { CheckCircle, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface KeyQuestionsProps {
  onClose?: () => void;
  onApplyAnswers?: (answers: Record<string, string>) => void;
}

export const KeyQuestionsModal: React.FC<KeyQuestionsProps> = ({ onApplyAnswers }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    examType: "UNMSM - San Marcos (Examen DECO 🇵🇪)",
    targetDuration: "6 meses",
    mockFrequency: "Semanal",
    dailyReminderTime: "Notificaciones Nocturnas (Revisión de metas al terminar clases)",
    parentInvolvement: "No, uso 100% personal e independiente del alumno",
    studyMode: "Mixto (Autodidacta + IA Tutor)",
  });

  const [submitted, setSubmitted] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  // Accordion state: by default all steps are collapsed
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const toggleStep = (stepNumber: number) => {
    setOpenSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const handleSelect = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onApplyAnswers) {
      onApplyAnswers({ ...answers, customNotes });
    }
  };

  return (
    <div className="space-y-4 text-[#2D3436]">
      {/* Intro banner */}
      <div className="bg-transparent sm:bg-[#2D3436] rounded-none sm:rounded-3xl p-0 sm:p-7 shadow-none sm:shadow-md relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          {/* Oculto el icono de mensaje de fondo azul por requerimiento */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD93D] text-[#8B6E00] text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8B6E00]" />
              <span>PASO CLAVE DE PRODUCTO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#2D3436] sm:text-white">
              Preguntas Clave para Personalizar tu Experiencia
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 sm:text-slate-300 font-medium leading-relaxed">
              Estructura las preferencias estratégicas fundamentales para refinar
              el plan de preparación preuniversitaria. Puedes seleccionarlas directamente desplegando cada paso.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-[#EBFBEE] border-2 border-[#6BCB77] rounded-3xl p-5 text-[#1E5627] text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 bg-[#6BCB77] rounded-full flex items-center justify-center mx-auto text-white font-black">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#2D3436]">¡Respuestas Guardadas y Aplicadas al Prototipo!</h3>
          <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto">
            Hemos adaptado tu configuración inicial. Puedes seguir probando el simulacro, el planificador diario y el tutor IA en la barra de navegación.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-1 text-xs text-[#4D96FF] font-black underline hover:text-blue-700 cursor-pointer"
          >
            Modificar mis respuestas
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-slate-200 transition-all">
          <button
            type="button"
            onClick={() => toggleStep(1)}
            className="w-full flex items-center justify-between text-left cursor-pointer gap-2 min-h-[40px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#EBF3FF] text-[#4D96FF] font-black text-xs px-2.5 py-1 rounded-lg">Paso 1</span>
                <h3 className="font-black text-[#2D3436] text-sm sm:text-base truncate">
                  Universidad o Examen Nacional Objetivo
                </h3>
              </div>
              {!openSteps[1] && (
                <p className="text-xs text-[#4D96FF] font-bold mt-1 truncate">
                  Seleccionado: {answers.examType}
                </p>
              )}
            </div>
            <div className="p-1.5 bg-slate-100 rounded-xl text-slate-600 shrink-0">
              {openSteps[1] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSteps[1] && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                En Perú las universidades tienen formatos específicos (ej. Modelo DECO® en San Marcos, ciencias puras en la UNI, prueba talento PUCP o examen de admisión en UNALM).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "UNMSM - San Marcos (Examen DECO 🇵🇪)",
                  "UNI - Nacional de Ingeniería (🇵🇪)",
                  "PUCP - Católica (Prueba Talento 🇵🇪)",
                  "UNALM - Agraria La Molina (🇵🇪)",
                  "UNSA - San Agustín Arequipa (🇵🇪)",
                  "UNT - Nacional de Trujillo (🇵🇪)",
                  "UNFV - Federico Villarreal (🇵🇪)",
                  "Privadas (ULima / UP / UTEC / UPC 🇵🇪)",
                ].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleSelect("examType", option)}
                    className={`px-3.5 py-2 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
                      answers.examType === option
                        ? "bg-[#EBF3FF] border-[#4D96FF] text-[#4D96FF] font-black shadow-2xs"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                    }`}
                  >
                    <span>{option}</span>
                    {answers.examType === option && <CheckCircle className="w-4 h-4 text-[#4D96FF] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-slate-200 transition-all">
          <button
            type="button"
            onClick={() => toggleStep(2)}
            className="w-full flex items-center justify-between text-left cursor-pointer gap-2 min-h-[40px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#EBFBEE] text-[#1E5627] font-black text-xs px-2.5 py-1 rounded-lg">Paso 2</span>
                <h3 className="font-black text-[#2D3436] text-sm sm:text-base truncate">
                  Duración y Tiempo de Preparación
                </h3>
              </div>
              {!openSteps[2] && (
                <p className="text-xs text-[#6BCB77] font-bold mt-1 truncate">
                  Seleccionado: {answers.targetDuration}
                </p>
              )}
            </div>
            <div className="p-1.5 bg-slate-100 rounded-xl text-slate-600 shrink-0">
              {openSteps[2] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSteps[2] && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                ¿Qué duraciones debemos priorizar para compaginar el estudio con las actividades del estudiante?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: "2 Meses (Express / Intensivo)", value: "2 meses" },
                  { label: "3 a 4 Meses (Estándar Corto)", value: "3 meses" },
                  { label: "6 Meses (Semestral Completo)", value: "6 meses" },
                  { label: "9 a 12 Meses (Anual Gradual)", value: "1 año" },
                ].map((dur) => (
                  <button
                    type="button"
                    key={dur.value}
                    onClick={() => handleSelect("targetDuration", dur.value)}
                    className={`px-3.5 py-2 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
                      answers.targetDuration === dur.value
                        ? "bg-[#EBFBEE] border-[#6BCB77] text-[#1E5627] font-black shadow-2xs"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                    }`}
                  >
                    <span>{dur.label}</span>
                    {answers.targetDuration === dur.value && <CheckCircle className="w-4 h-4 text-[#6BCB77] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-slate-200 transition-all">
          <button
            type="button"
            onClick={() => toggleStep(3)}
            className="w-full flex items-center justify-between text-left cursor-pointer gap-2 min-h-[40px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFF3BF] text-[#8B6E00] font-black text-xs px-2.5 py-1 rounded-lg">Paso 3</span>
                <h3 className="font-black text-[#2D3436] text-sm sm:text-base truncate">
                  Recordatorios Diarios y Ludificación
                </h3>
              </div>
              {!openSteps[3] && (
                <p className="text-xs text-[#8B6E00] font-bold mt-1 truncate">
                  Configuración: {answers.dailyReminderTime}
                </p>
              )}
            </div>
            <div className="p-1.5 bg-slate-100 rounded-xl text-slate-600 shrink-0">
              {openSteps[3] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSteps[3] && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                ¿Cómo deseas que funcionen las alertas diarias y la disciplina gamificada?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Notificaciones Nocturnas (Revisión de metas al terminar clases)",
                  "Recordatorios Matutinos (Micro-reto del día)",
                  "Pomodoro Guiado con Rachas y Recompensas (Estilo Duolingo)",
                ].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleSelect("dailyReminderTime", option)}
                    className={`px-3.5 py-2 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
                      answers.dailyReminderTime === option
                        ? "bg-[#FFF3BF] border-[#FFD93D] text-[#8B6E00] font-black shadow-2xs"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                    }`}
                  >
                    <span>{option}</span>
                    {answers.dailyReminderTime === option && <CheckCircle className="w-4 h-4 text-[#E67E22] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-slate-200 transition-all">
          <button
            type="button"
            onClick={() => toggleStep(4)}
            className="w-full flex items-center justify-between text-left cursor-pointer gap-2 min-h-[40px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFF5F5] text-[#FF6B6B] font-black text-xs px-2.5 py-1 rounded-lg">Paso 4</span>
                <h3 className="font-black text-[#2D3436] text-sm sm:text-base truncate">
                  Reporte de Avance a Padres o Tutores
                </h3>
              </div>
              {!openSteps[4] && (
                <p className="text-xs text-[#FF6B6B] font-bold mt-1 truncate">
                  Opción: {answers.parentInvolvement}
                </p>
              )}
            </div>
            <div className="p-1.5 bg-slate-100 rounded-xl text-slate-600 shrink-0">
              {openSteps[4] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSteps[4] && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                ¿Deseas activar la opción de reporte semanal en PDF o correo con el porcentaje de cumplimiento y puntajes?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Sí, enviar reporte semanal a padres/tutores",
                  "No, uso 100% personal e independiente del alumno",
                  "Opcional (Exportar informe en PDF bajo demanda)",
                ].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleSelect("parentInvolvement", option)}
                    className={`px-3.5 py-2 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
                      answers.parentInvolvement === option
                        ? "bg-[#FFF5F5] border-[#FF6B6B] text-[#FF6B6B] font-black shadow-2xs"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                    }`}
                  >
                    <span>{option}</span>
                    {answers.parentInvolvement === option && <CheckCircle className="w-4 h-4 text-[#FF6B6B] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-slate-200 transition-all">
          <button
            type="button"
            onClick={() => toggleStep(5)}
            className="w-full flex items-center justify-between text-left cursor-pointer gap-2 min-h-[40px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 text-slate-700 font-black text-xs px-2.5 py-1 rounded-lg">Paso 5</span>
                <h3 className="font-black text-[#2D3436] text-sm sm:text-base truncate">
                  Reglas o Notas Adicionales
                </h3>
              </div>
              {!openSteps[5] && (
                <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                  {customNotes ? `Nota: "${customNotes}"` : "Sin observaciones adicionales"}
                </p>
              )}
            </div>
            <div className="p-1.5 bg-slate-100 rounded-xl text-slate-600 shrink-0">
              {openSteps[5] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSteps[5] && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <label className="block font-bold text-slate-600 text-xs">
                ¿Alguna especificación adicional para personalizar tu simulador?
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ejemplo: 'Preguntas de razonamiento verbal situacional' o 'Ranking entre compañeros'..."
                className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-[#2D3436] placeholder-slate-400 focus:outline-none focus:border-[#4D96FF] h-20 font-medium"
              />
            </div>
          )}
        </div>

        {/* Form action button - updated label to "Guardar cambios" as requested */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black text-xs px-8 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer uppercase tracking-wider min-h-[40px]"
          >
            <span>Guardar cambios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
