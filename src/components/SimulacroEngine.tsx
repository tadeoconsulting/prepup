import React, { useState } from "react";
import { Question, UserPlan, SimulacroResult } from "../types";
import { INITIAL_SAMPLE_QUESTIONS } from "../data/presetProfiles";
import { GraduationCap, Timer, Sparkles, CheckCircle2, XCircle, RefreshCw, Award, ArrowRight, HelpCircle, AlertCircle, BookOpen } from "lucide-react";

interface SimulacroEngineProps {
  plan: UserPlan;
  onSaveResult: (result: SimulacroResult) => void;
}

export const SimulacroEngine: React.FC<SimulacroEngineProps> = ({ plan, onSaveResult }) => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_SAMPLE_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState<string>("Matemáticas");
  const [difficulty, setDifficulty] = useState<string>("Media");

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleGenerateAISimulacro = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/ai/generate-simulacro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: plan.targetCountry,
          university: plan.targetUniversity,
          career: plan.targetCareer,
          subject: customSubject,
          difficulty: difficulty,
          questionCount: 5,
        }),
      });

      if (!res.ok) {
        throw new Error("Respuesta no OK del servidor");
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error("Error al generar simulacro:", err);
      alert("Se usaron las preguntas por defecto debido a un aviso de conexión.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitSimulacro = () => {
    setIsSubmitted(true);
    const correctCount = calculateScore();
    const scorePct = Math.round((correctCount / questions.length) * 100);

    const result: SimulacroResult = {
      id: "sim_" + Date.now(),
      date: new Date().toISOString(),
      title: `Simulacro ${customSubject} (${plan.targetUniversity})`,
      subject: customSubject,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      projectedExamScore: Math.round((scorePct / 100) * 1000),
      timeSpentSeconds: 300,
      weakTopicsIdentified: questions
        .filter((q, idx) => selectedAnswers[idx] !== q.correctIndex)
        .map((q) => q.topic),
    };

    onSaveResult(result);
  };

  const resetTest = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-6 text-[#2D3436]">
      {/* Header Bar - Mobile 100% width banner matching UNALM style */}
      <div className="-mx-4 -mt-6 sm:mx-0 sm:mt-0 bg-[#2D3436] rounded-none sm:rounded-3xl p-5 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Ocultar icono en mobile para ganar espacio */}
            <div className="hidden sm:flex p-3.5 bg-[#FF6B6B] rounded-2xl text-white font-black shrink-0 shadow-md">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            {/* Texto y etiqueta estructurados en filas */}
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD93D] text-[#8B6E00] text-xs font-black self-start">
                <span>EXAMEN TIPO: {plan.targetUniversity} ({plan.targetCountry})</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-snug mt-0.5">
                Simulacro Personalizado en Vivo
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl leading-relaxed">
                Pon a prueba tus conocimientos con preguntas situacionales tipo examen de admisión adaptadas a tu universidad.
              </p>
            </div>
          </div>

          {/* AI Generator Bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center gap-2 text-xs shrink-0">
            <select
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="bg-white text-[#2D3436] font-extrabold rounded-xl px-3.5 py-2 focus:outline-none text-xs flex-1 sm:flex-initial min-h-[40px]"
            >
              <option value="Matemáticas">Matemáticas y Razonamiento</option>
              <option value="Lectura Crítica">Lectura Crítica / Verbal</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
              <option value="Biología">Biología</option>
              <option value="Historia">Historia y Sociales</option>
            </select>

            <button
              onClick={handleGenerateAISimulacro}
              disabled={isLoadingAI}
              className="w-full sm:w-auto px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider text-[11px] min-h-[40px]"
            >
              {isLoadingAI ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-200" />
              )}
              <span>{isLoadingAI ? "Generando..." : "Generar con IA"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Body */}
      {isSubmitted ? (
        /* Results Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-b-4 border-slate-200 text-[#2D3436]">
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 bg-[#EBF3FF] border-2 border-[#4D96FF] rounded-full flex items-center justify-center mx-auto text-[#4D96FF]">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#2D3436]">Resultados del Simulacro</h3>
            <p className="text-xs text-slate-500 font-bold">
              Materia: <span className="text-[#4D96FF] font-black">{customSubject}</span> • Adaptado para {plan.targetUniversity}
            </p>

            <div className="inline-flex items-center space-x-6 bg-[#F8FAFC] px-8 py-3.5 rounded-2xl border-2 border-slate-100 mt-2">
              <div>
                <div className="text-xs text-slate-400 font-bold">Aciertos</div>
                <div className="text-xl font-black text-[#6BCB77]">
                  {calculateScore()} / {questions.length}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <div className="text-xs text-slate-400 font-bold">Porcentaje</div>
                <div className="text-xl font-black text-[#4D96FF]">
                  {Math.round((calculateScore() / questions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h4 className="font-black text-[#2D3436] text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4D96FF]" />
              <span>Revisión Explicada Paso a Paso</span>
            </h4>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id || idx}
                  className={`p-5 rounded-2xl border-2 text-xs space-y-3 ${
                    isCorrect
                      ? "bg-[#EBFBEE] border-[#6BCB77]"
                      : "bg-[#FFF5F5] border-[#FF6B6B]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-black text-[#2D3436] text-sm">
                      Pregunta {idx + 1}: {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[#1E5627] font-black shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#6BCB77]" /> Correcta
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#FF6B6B] font-black shrink-0">
                        <XCircle className="w-4 h-4" /> Incorrecta
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl font-mono text-xs ${
                          oIdx === q.correctIndex
                            ? "bg-[#6BCB77] text-white font-black"
                            : oIdx === userAns
                            ? "bg-[#FF6B6B] text-white font-black"
                            : "text-slate-600 font-semibold"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}) {opt}
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium leading-relaxed">
                    <strong className="text-[#4D96FF] font-black">Explicación del Profesor:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={resetTest}
              className="px-8 py-3.5 bg-[#4D96FF] hover:bg-blue-600 text-white rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              Reiniciar Simulacro
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Display */
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-b-4 border-slate-200 text-[#2D3436]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs">
            <span className="text-slate-500 font-extrabold">
              Pregunta <strong className="text-[#4D96FF]">{currentQuestionIndex + 1}</strong> de {questions.length}
            </span>
            <span className="px-3 py-1 bg-[#EBF3FF] text-[#4D96FF] rounded-full font-black">
              Tema: {currentQ?.topic}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-black text-[#2D3436] leading-snug">
              {currentQ?.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
                      isSelected
                        ? "bg-[#EBF3FF] border-[#4D96FF] text-[#4D96FF] font-black shadow-xs"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-700 hover:border-slate-300 font-semibold"
                    }`}
                  >
                    <span>
                      <strong className="mr-2 text-[#4D96FF] font-black">{String.fromCharCode(65 + optIdx)})</strong>
                      {opt}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4D96FF] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer min-h-[40px]"
            >
              Anterior
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer uppercase tracking-wider min-h-[40px]"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmitSimulacro}
                className="px-6 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all shadow-md cursor-pointer uppercase tracking-wider min-h-[40px]"
              >
                Finalizar y Calificar Examen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
