import React, { useState, useEffect } from "react";
import {
  UNALM_SOLVED_EXAM_QUESTIONS,
  UNALM_GAMIFIED_BADGES,
  UNALMQuestion,
  UNALMBadge,
} from "../data/unalmExamData";
import {
  GraduationCap,
  Sparkles,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  RotateCcw,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
  Heart,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  FileText,
} from "lucide-react";

export const AgrariaGamifiedEngine: React.FC = () => {
  const [questions, setQuestions] = useState<UNALMQuestion[]>(UNALM_SOLVED_EXAM_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"game" | "analysis" | "badges">("game");

  // Gamification state
  const [xp, setXp] = useState<number>(150);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [badges, setBadges] = useState<UNALMBadge[]>(UNALM_GAMIFIED_BADGES);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const currentQ = questions[currentIndex];

  // Calculate Level
  const getLevelInfo = (currentXp: number) => {
    if (currentXp < 300) {
      return { level: 1, title: "Semilla Molinera 🌱", nextXp: 300, color: "text-[#4D96FF]" };
    } else if (currentXp < 600) {
      return { level: 2, title: "Cachimbo de Ciencias 🌿", nextXp: 600, color: "text-[#6BCB77]" };
    } else if (currentXp < 1000) {
      return { level: 3, title: "Investigador Agrario 🧪", nextXp: 1000, color: "text-[#FF6B6B]" };
    } else {
      return { level: 4, title: "Catedrático La Molina 🏆", nextXp: 2000, color: "text-[#FFD93D]" };
    }
  };

  const levelInfo = getLevelInfo(xp);

  const handleSelectOption = (index: number) => {
    if (isAnswered || disabledOptions.includes(index)) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);

      // XP Calculation with streak multiplier
      const multiplier = newStreak >= 3 ? 1.5 : 1.0;
      const earnedXp = Math.round(currentQ.xpValue * multiplier);
      setXp((prev) => prev + earnedXp);

      // Check badges
      checkBadges(newStreak, currentQ.subject);
    } else {
      if (shieldActive) {
        setShieldActive(false); // Shield consumed
      } else {
        setStreak(0);
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setGameFinished(true);
          }
          return Math.max(0, nextLives);
        });
      }
    }
  };

  const checkBadges = (currentStreak: number, subject: string) => {
    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.id === "b2" && subject === "Biología y Botánica" && currentStreak >= 3) {
          return { ...badge, unlocked: true };
        }
        if (badge.id === "b4" && currentStreak >= 5) {
          return { ...badge, unlocked: true };
        }
        return badge;
      })
    );
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setDisabledOptions([]);
      setShowTip(false);
    } else {
      setGameFinished(true);
      // Unlock final badge if score >= 80%
      if (correctCount / questions.length >= 0.8) {
        setBadges((prev) =>
          prev.map((b) => (b.id === "b5" ? { ...b, unlocked: true } : b))
        );
      }
    }
  };

  // Power-up 1: 50/50
  const useFiftyFifty = () => {
    if (isAnswered || disabledOptions.length > 0 || xp < 30) return;
    setXp((prev) => prev - 30);
    const incorrectIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);
    // Shuffle and pick 2 to disable
    const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
    setDisabledOptions([shuffled[0], shuffled[1]]);
  };

  // Power-up 2: Hint
  const useHint = () => {
    if (showTip || xp < 20) return;
    setXp((prev) => prev - 20);
    setShowTip(true);
  };

  // Power-up 3: Shield
  const useShield = () => {
    if (shieldActive || xp < 40) return;
    setXp((prev) => prev - 40);
    setShieldActive(true);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setLives(3);
    setStreak(0);
    setDisabledOptions([]);
    setShowTip(false);
    setShieldActive(false);
    setGameFinished(false);
    setCorrectCount(0);
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-[#2D3436]">
      {/* Banner Superior UNALM - 100% ancho en mobile, 0px desde top bar */}
      <div className="-mx-4 -mt-6 sm:mx-0 sm:mt-0 bg-[#2D3436] rounded-none sm:rounded-3xl p-5 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Ocultar el icono verde en mobile para ganar espacio */}
            <div className="hidden sm:flex p-3.5 bg-[#6BCB77] rounded-2xl text-white font-black shrink-0 shadow-md">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            
            {/* Texto y etiqueta estructurados en 2 filas */}
            <div className="flex flex-col gap-1.5">
              {/* Fila 1: Etiqueta */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD93D] text-[#8B6E00] text-xs font-black self-start">
                <span>🇵🇪 UNALM - LA AGRARIA MOLINA</span>
                <span className="bg-white/40 px-2 py-0.2 rounded-md">GAMIFICADO</span>
              </div>
              {/* Fila 2: Título y Descripción */}
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-snug mt-0.5">
                Desafío Molinero: Examen Resuelto Gamificado
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl leading-relaxed">
                Entrena con preguntas reales resueltas del examen de admisión de La Agraria en Biología, Botánica, Química y Razonamiento, ganando puntos de experiencia y medallas.
              </p>
            </div>
          </div>

          {/* User Status Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-2xl shrink-0 flex items-center justify-between md:justify-start gap-4 sm:gap-5">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-300 block">
                Tu Nivel
              </span>
              <span className={`text-sm sm:text-base font-black ${levelInfo.color}`}>
                {levelInfo.title}
              </span>
              <div className="w-28 sm:w-32 bg-white/20 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                  className="bg-[#6BCB77] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (xp / levelInfo.nextXp) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-300 block">
                Puntos XP
              </span>
              <span className="text-lg sm:text-xl font-black text-[#FFD93D] flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4 fill-[#FFD93D]" /> {xp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vista de Tabs estilo línea horizontal (100% ancho en pantalla) */}
      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 border-b-2 border-slate-200 overflow-x-auto scrollbar-none">
        <div className="flex space-x-2 sm:space-x-6 min-w-max">
          <button
            onClick={() => setActiveTab("game")}
            className={`py-2.5 px-3.5 sm:px-4 sm:py-3 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap relative min-h-[40px] ${
              activeTab === "game"
                ? "text-[#1E5627] font-black border-b-3 border-[#6BCB77] -mb-[2px]"
                : "text-slate-500 hover:text-slate-800 font-bold border-b-3 border-transparent"
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === "game" ? "text-[#6BCB77]" : "text-slate-400"}`} />
            <span>Reto Gamificado UNALM</span>
          </button>

          <button
            onClick={() => setActiveTab("analysis")}
            className={`py-2.5 px-3.5 sm:px-4 sm:py-3 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap relative min-h-[40px] ${
              activeTab === "analysis"
                ? "text-[#4D96FF] font-black border-b-3 border-[#4D96FF] -mb-[2px]"
                : "text-slate-500 hover:text-slate-800 font-bold border-b-3 border-transparent"
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === "analysis" ? "text-[#4D96FF]" : "text-slate-400"}`} />
            <span>Análisis del Examen Agrario</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`py-2.5 px-3.5 sm:px-4 sm:py-3 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap relative min-h-[40px] ${
              activeTab === "badges"
                ? "text-[#8B6E00] font-black border-b-3 border-[#FFD93D] -mb-[2px]"
                : "text-slate-500 hover:text-slate-800 font-bold border-b-3 border-transparent"
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === "badges" ? "text-[#E67E22]" : "text-slate-400"}`} />
            <span>Medallas y Logros ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Game View */}
      {activeTab === "game" && (
        <>
          {!gameFinished ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Main Question Box (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-8 shadow-xs border-b-4 border-slate-200 space-y-4 sm:space-y-6">
                {/* Stats Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-1">
                    <span className="bg-[#EBFBEE] text-[#1E5627] font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border border-green-200">
                      Pregunta {currentIndex + 1} de {questions.length}
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#4D96FF] bg-[#EBF3FF] px-2.5 sm:px-3 py-1 rounded-full">
                      {currentQ.subject}
                    </span>
                  </div>

                  {/* Lives & Streak */}
                  <div className="flex items-center justify-between w-full sm:w-auto space-x-3 pt-1 sm:pt-0">
                    <div className="flex items-center space-x-1" title="Vidas restantes">
                      {[...Array(3)].map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < lives
                              ? "text-[#FF6B6B] fill-[#FF6B6B]"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center space-x-1 bg-[#FFF3BF] text-[#8B6E00] px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black">
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FFD93D]" />
                      <span>Racha: x{streak}</span>
                    </div>
                  </div>
                </div>

                {/* Question Details */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                      Tema: {currentQ.topic}
                    </span>
                    <span className="text-[10px] sm:text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                      +{currentQ.xpValue} XP
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-[#2D3436] leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-1 sm:pt-2">
                  {currentQ.options.map((optionText, idx) => {
                    const isDisabled = disabledOptions.includes(idx);
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle =
                      "bg-[#F8FAFC] border-2 border-slate-200 text-[#2D3436] hover:border-[#4D96FF] hover:bg-[#EBF3FF]";

                    if (isDisabled) {
                      btnStyle = "bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed";
                    } else if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-[#EBFBEE] border-2 border-[#6BCB77] text-[#1E5627] font-black shadow-md";
                      } else if (isSelected) {
                        btnStyle = "bg-[#FFF5F5] border-2 border-[#FF6B6B] text-[#900C3F] font-black";
                      } else {
                        btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered || isDisabled}
                        className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-left transition-all duration-150 flex items-center justify-between cursor-pointer min-h-[40px] ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-2.5 sm:space-x-3 pr-2">
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs shrink-0 text-slate-600">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{optionText}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-[#6BCB77] shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-[#FF6B6B] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Profesor Molinero Solved Explanation Card */}
                {isAnswered && (
                  <div className="bg-[#EBF3FF] border-2 border-[#4D96FF] rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 sm:p-2 bg-[#4D96FF] text-white rounded-xl">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD93D]" />
                        </div>
                        <h4 className="font-black text-[#2D3436] text-xs sm:text-sm">
                          Solucionario Oficial del Profesor Molinero
                        </h4>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-[#4D96FF] bg-white px-2.5 py-1 rounded-full border border-blue-200">
                        Paso a Paso
                      </span>
                    </div>

                    <p className="text-xs text-[#2D3436] font-medium leading-relaxed bg-white p-3 sm:p-3.5 rounded-xl border border-blue-100">
                      {currentQ.explanation}
                    </p>

                    <div className="bg-[#FFF3BF] border border-amber-300 p-3 rounded-xl text-xs text-[#8B6E00] font-bold flex items-start gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#8B6E00]" />
                      <span>{currentQ.molineroTip}</span>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-6 py-3 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer uppercase tracking-wider min-h-[44px]"
                      >
                        <span>Siguiente Pregunta</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Power-ups & Gamification Panel (4 cols) */}
              <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                {/* Comodines / Power-ups Card */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border-b-4 border-slate-200 space-y-3 sm:space-y-4">
                  <h3 className="font-black text-[#2D3436] text-xs sm:text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD93D]" />
                    <span>Comodines de Examen</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Usa tus puntos XP para activar ventajas tácticas durante la resolución.
                  </p>

                  <div className="space-y-2">
                    {/* Powerup 1: 50/50 */}
                    <button
                      onClick={useFiftyFifty}
                      disabled={isAnswered || disabledOptions.length > 0 || xp < 30}
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-[#EBF3FF] border-2 border-slate-200 hover:border-[#4D96FF] rounded-2xl flex items-center justify-between text-xs font-black cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="p-1.5 sm:p-2 bg-[#4D96FF] text-white rounded-xl text-xs">🧪</span>
                        <div className="text-left">
                          <span className="block text-[#2D3436]">Descarte 50/50</span>
                          <span className="text-[10px] text-slate-400 font-bold block sm:inline">Elimina 2 incorrectas</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-[#8B6E00] px-2 py-0.5 rounded-md font-extrabold text-[10px] shrink-0">
                        -30 XP
                      </span>
                    </button>

                    {/* Powerup 2: Hint */}
                    <button
                      onClick={useHint}
                      disabled={showTip || xp < 20}
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-[#FFF3BF] border-2 border-slate-200 hover:border-amber-400 rounded-2xl flex items-center justify-between text-xs font-black cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="p-1.5 sm:p-2 bg-[#FFD93D] text-[#8B6E00] rounded-xl text-xs">💡</span>
                        <div className="text-left">
                          <span className="block text-[#2D3436]">Pista del Catedrático</span>
                          <span className="text-[10px] text-slate-400 font-bold block sm:inline">Muestra el tip clave</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-[#8B6E00] px-2 py-0.5 rounded-md font-extrabold text-[10px] shrink-0">
                        -20 XP
                      </span>
                    </button>

                    {/* Powerup 3: Shield */}
                    <button
                      onClick={useShield}
                      disabled={shieldActive || xp < 40}
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-[#EBFBEE] border-2 border-slate-200 hover:border-[#6BCB77] rounded-2xl flex items-center justify-between text-xs font-black cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="p-2 bg-[#6BCB77] text-white rounded-xl">🛡️</span>
                        <div className="text-left">
                          <span className="block text-[#2D3436]">Escudo Molinero</span>
                          <span className="text-[10px] text-slate-400 font-bold">Protege tu racha si te equivocas</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-[#8B6E00] px-2 py-0.5 rounded-md font-extrabold text-[10px]">
                        {shieldActive ? "Activo" : "-40 XP"}
                      </span>
                    </button>
                  </div>

                  {showTip && (
                    <div className="bg-[#FFF3BF] border border-amber-300 p-3.5 rounded-2xl text-xs text-[#8B6E00] font-bold space-y-1 animate-in fade-in duration-150">
                      <span className="block font-black text-[11px] uppercase tracking-wider">💡 Pista Revelada:</span>
                      <p className="font-medium text-slate-800">{currentQ.molineroTip}</p>
                    </div>
                  )}
                </div>

                {/* Direct Tip Card */}
                <div className="bg-[#EBF3FF] rounded-3xl p-5 border border-blue-200 space-y-2">
                  <div className="flex items-center space-x-2 text-[#4D96FF] font-black text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Estructura del Examen UNALM</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    El examen de La Agraria evalúa con especial rigor la biología vegetal, química general y el razonamiento lógico. Cada acierto otorga puntaje positivo decisivo.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Game Finished / Results Screen */
            <div className="bg-white rounded-3xl p-8 shadow-sm border-b-4 border-slate-200 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-[#FFF3BF] border-4 border-[#FFD93D] rounded-full flex items-center justify-center mx-auto text-4xl shadow-md">
                🏆
              </div>

              <div className="space-y-2">
                <span className="bg-[#EBFBEE] text-[#1E5627] text-xs font-black px-3 py-1 rounded-full border border-green-200 uppercase tracking-wider">
                  ¡Reto Molinero Completado!
                </span>
                <h3 className="text-2xl font-black text-[#2D3436]">
                  Resultado de tu Desafío Agrario
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Has practicado con preguntas reales resueltas del examen de admisión de La Agraria.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Aciertos</span>
                  <span className="text-2xl font-black text-[#6BCB77]">
                    {correctCount} / {questions.length}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Puntos Ganados</span>
                  <span className="text-2xl font-black text-[#FFD93D]">+{xp} XP</span>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Efectividad</span>
                  <span className="text-2xl font-black text-[#4D96FF]">
                    {Math.round((correctCount / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={restartGame}
                  className="px-6 py-3 bg-[#4D96FF] hover:bg-blue-600 text-white font-black text-xs rounded-2xl shadow-md flex items-center space-x-2 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Volver a Intentar</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Analysis View */}
      {activeTab === "analysis" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-b-4 border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-[#2D3436] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#4D96FF]" />
              <span>Análisis Técnico del Examen de Admisión UNALM (La Agraria)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Desglose detallado del formato de prueba, ponderación por asignaturas y estrategia táctica para el ingreso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Weights */}
            <div className="space-y-4">
              <h4 className="font-black text-[#2D3436] text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6BCB77] hidden sm:block" />
                <span>Ponderación por Asignaturas Clave</span>
              </h4>

              <div className="space-y-3 text-xs w-full">
                <div className="w-full">
                  <div className="flex justify-between items-center w-full mb-1 gap-2">
                    <span className="font-normal text-slate-700">Biología y Botánica Sistemática</span>
                    <span className="text-[#6BCB77] font-black text-right shrink-0">20% (Alta prioridad)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#6BCB77] h-full w-[20%] rounded-full"></div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center w-full mb-1 gap-2">
                    <span className="font-normal text-slate-700">Razonamiento Lógico-Matemático</span>
                    <span className="text-[#4D96FF] font-black text-right shrink-0">20% (Alta velocidad)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#4D96FF] h-full w-[20%] rounded-full"></div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center w-full mb-1 gap-2">
                    <span className="font-normal text-slate-700">Química General e Inorgánica</span>
                    <span className="text-[#FF6B6B] font-black text-right shrink-0">15% (Cálculos rápidos)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF6B6B] h-full w-[15%] rounded-full"></div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center w-full mb-1 gap-2">
                    <span className="font-normal text-slate-700">Física Aplicada y Mecánica</span>
                    <span className="text-[#E67E22] font-black text-right shrink-0">15%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#E67E22] h-full w-[15%] rounded-full"></div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center w-full mb-1 gap-2">
                    <span className="font-normal text-slate-700">Razonamiento Verbal y Lenguaje</span>
                    <span className="text-[#8B6E00] font-black text-right shrink-0">15%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#FFD93D] h-full w-[15%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Secrets */}
            <div className="space-y-4">
              <h4 className="font-black text-[#2D3436] text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FFD93D] hidden sm:block" />
                <span>5 Claves para Asegurar la Vacante en La Agraria</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                  <span className="font-black text-[#2D3436] block">1. Domina la Botánica y Citología</span>
                  <span className="text-slate-500">A diferencia de otras universidades, La Agraria pregunta específicamente por tejidos vegetales (colénquima, esclerénquima) y plastidios.</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                  <span className="font-black text-[#2D3436] block">2. Estequiometría sin Calculadora</span>
                  <span className="text-slate-500">Aprende a simplificar fracciones en masa equivalente y moles rápidamente para ganar minutos valiosos.</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                  <span className="font-black text-[#2D3436] block">3. Tiempo Promedio: 1.2 minutos/pregunta</span>
                  <span className="text-slate-500">Asegura primero las preguntas directas de Biología y Lenguaje antes de entrar a los problemas extensos de Física.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Badges View */}
      {activeTab === "badges" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-b-4 border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-[#2D3436] flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#FFD93D]" />
              <span>Insignias de Logro Agrario Desbloqueables</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Completa los retos de preparación para obtener las medallas oficiales del campus virtual UNALM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border-2 transition-all flex items-start space-x-3 ${
                  badge.unlocked
                    ? "bg-[#FFF3BF] border-[#FFD93D] shadow-xs"
                    : "bg-[#F8FAFC] border-slate-200 opacity-60"
                }`}
              >
                <div className="text-3xl shrink-0 p-2 bg-white rounded-2xl shadow-2xs">
                  {badge.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-black text-[#2D3436] text-xs">{badge.name}</h4>
                    {badge.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-[#6BCB77]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-1">
                    {badge.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-wider text-[#8B6E00]">
                    {badge.unlocked ? "¡DESBLOQUEADO!" : "BLOQUEADO"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
