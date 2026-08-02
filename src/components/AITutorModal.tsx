import React, { useState } from "react";
import { Sparkles, Send, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, GraduationCap } from "lucide-react";

interface AITutorProps {
  defaultTopic?: string;
  targetExam?: string;
}

export const AITutorModal: React.FC<AITutorProps> = ({ defaultTopic = "", targetExam = "Examen de Admisión" }) => {
  const [subject, setSubject] = useState<string>("Matemáticas");
  const [topic, setTopic] = useState<string>(defaultTopic || "Factorización y Álgebra");
  const [doubt, setDoubt] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setExplanation("");

    try {
      const res = await fetch("/api/ai/explain-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          doubt,
          targetExam,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      } else {
        setExplanation("No se pudo obtener la explicación en este momento.");
      }
    } catch (err) {
      console.error(err);
      setExplanation("Error al conectar con el servidor del tutor IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#2D3436]">
      {/* Banner */}
      <div className="bg-[#2D3436] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-[#4D96FF] rounded-2xl text-white font-black shrink-0 shadow-md">
            <Sparkles className="w-7 h-7 text-[#FFD93D]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD93D] text-[#8B6E00] text-xs font-black mb-2.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#8B6E00]" />
              <span>TUTOR IA PREUNIVERSITARIO</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Resuelve tus Dudas Paso a Paso</h2>
            <p className="text-xs text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Introduce cualquier ejercicio, fórmula o tema difícil. La IA lo desglosará con ejemplos tipo examen y recomendaciones para evitar trampas comunes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form (1 Col) */}
        <div className="bg-white rounded-3xl p-6 text-[#2D3436] space-y-4 shadow-sm border-b-4 border-slate-200">
          <h3 className="font-black text-[#2D3436] text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4D96FF]" />
            <span>¿En qué tema necesitas ayuda?</span>
          </h3>

          <form onSubmit={handleAskTutor} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Materia</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
              >
                <option value="Matemáticas">Matemáticas y Razonamiento</option>
                <option value="Lectura Crítica">Lectura Crítica / Lenguaje</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Biología">Biología</option>
                <option value="Historia">Historia / Geografía</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Tema Específico</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej. Logaritmos o Leyes de Newton"
                className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] placeholder-slate-400 font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Tu Pregunta o Ejercicio Difícil (Opcional)</label>
              <textarea
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Ej. ¿Cómo resuelvo log_2(x+3) = 5? o ¿Por qué la opción B es la correcta en lectura crítica?"
                className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] placeholder-slate-400 font-semibold focus:outline-none focus:border-[#4D96FF] h-28"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider min-h-[40px]"
            >
              {isLoading ? (
                <span>Explicando...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Explicar Tema con IA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Area (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 text-[#2D3436] shadow-sm border-b-4 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-black text-[#2D3436] text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#FFD93D]" />
                <span>Explicación del Profesor IA</span>
              </h3>
              <span className="text-xs text-[#4D96FF] font-black bg-[#EBF3FF] px-3 py-1 rounded-full">
                Materia: {subject}
              </span>
            </div>

            {explanation ? (
              <div className="prose prose-xs max-w-none space-y-3 leading-relaxed text-[#2D3436] bg-[#F8FAFC] p-5 rounded-2xl border-2 border-slate-100 whitespace-pre-line font-medium">
                {explanation}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3 text-slate-400 font-medium">
                <Sparkles className="w-10 h-10 mx-auto text-[#4D96FF]/40" />
                <p className="text-xs max-w-sm mx-auto">
                  Selecciona una materia y un tema a la izquierda para recibir una explicación detallada con resolución de ejercicios tipo examen de admisión.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6BCB77] shrink-0" />
            <span>
              Explicación optimizada para exámenes de ingreso preuniversitarios de Latinoamérica.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
