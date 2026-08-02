import React, { useState, useEffect, useRef } from "react";
import { DailyTask, UserPlan } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Plus,
  Clock,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square,
  Volume2,
  VolumeX,
  Flame,
  Maximize2,
  ChevronUp
} from "lucide-react";

interface DailyPlannerProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<DailyTask, "id">) => void;
  plan: UserPlan;
  onLogStudyMinutes: (minutes: number) => void;
  onReloadCareerBaseTasks?: () => void;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  plan,
  onLogStudyMinutes,
  onReloadCareerBaseTasks,
}) => {
  // Pomodoro timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<"study" | "break">("study");
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Ref for scroll detection
  const mainPomodoroRef = useRef<HTMLDivElement>(null);
  const [showFloatingPomodoro, setShowFloatingPomodoro] = useState<boolean>(false);

  // New task form state
  const [newSubject, setNewSubject] = useState<string>("Matemáticas");
  const [newTopic, setNewTopic] = useState<string>("");
  const [newMinutes, setNewMinutes] = useState<number>(30);
  const [newPriority, setNewPriority] = useState<"Alta" | "Media" | "Baja">("Media");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Sound chime on timer finish using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Tone 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.8);

      // Tone 2
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); // E5
      gain2.gain.setValueAtTime(0.2, audioCtx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(audioCtx.currentTime + 0.2);
      osc2.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log("Audio play blocked or unavailable");
    }
  };

  // IntersectionObserver to reveal floating widget when main Pomodoro is off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingPomodoro(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (mainPomodoroRef.current) {
      observer.observe(mainPomodoroRef.current);
    }

    return () => {
      if (mainPomodoroRef.current) {
        observer.unobserve(mainPomodoroRef.current);
      }
    };
  }, []);

  const scrollToMainPomodoro = () => {
    if (mainPomodoroRef.current) {
      mainPomodoroRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      playBeep();
      setIsRunning(false);
      if (mode === "study") {
        onLogStudyMinutes(25);
        setCompletedPomodoros((prev) => prev + 1);
        setMode("break");
        setTimerSeconds(5 * 60);
      } else {
        setMode("study");
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, mode, soundEnabled]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode: "study" | "break" = "study") => {
    setIsRunning(false);
    setMode(newMode);
    setTimerSeconds(newMode === "study" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    onAddTask({
      date: new Date().toISOString().split("T")[0],
      subject: newSubject,
      topic: newTopic,
      estimatedMinutes: Number(newMinutes) || 30,
      completed: false,
      priority: newPriority,
    });
    setNewTopic("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-[#2D3436]">
      {/* Header & Streak Motivation - Mobile 100% width banner matching UNALM style */}
      <div className="-mx-4 -mt-6 sm:mx-0 sm:mt-0 bg-[#2D3436] rounded-none sm:rounded-3xl p-5 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Ocultar icono en mobile para ganar espacio */}
            <div className="hidden sm:flex p-3.5 bg-[#4D96FF] rounded-2xl text-white font-black shrink-0 shadow-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>

            {/* Texto y etiqueta estructurados en filas */}
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD93D] text-[#8B6E00] text-xs font-black self-start">
                <Sparkles className="w-3.5 h-3.5 text-[#8B6E00]" />
                <span>PLAN Y POMODORO</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-snug mt-0.5">
                Planificador Diario de Estudio
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl leading-relaxed">
                Organiza tus metas del día y utiliza el temporizador Pomodoro para máxima retención y productividad.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-[#4D96FF] hover:bg-blue-600 text-white rounded-2xl text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-500/20 shrink-0 cursor-pointer uppercase tracking-wider min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Meta Personalizada</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Daily Tasks Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {/* Career Base Curriculum Banner */}
          <div className="bg-[#EBF3FF] border-2 border-[#4D96FF]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-black text-[#4D96FF] flex items-center gap-1.5 text-xs">
                <span>🎓</span> Temas Base para: {plan.targetCareer}
              </span>
              <p className="text-[11px] text-slate-600 font-medium">
                Contenido temático oficial según el prospecto de tu carrera. Las metas inician sin marcar para que registres tu avance.
              </p>
            </div>
            {onReloadCareerBaseTasks && (
              <button
                onClick={onReloadCareerBaseTasks}
                className="px-3 py-1.5 bg-white border border-[#4D96FF] text-[#4D96FF] hover:bg-blue-50 font-bold text-[11px] rounded-xl shrink-0 cursor-pointer shadow-2xs transition-colors"
              >
                Cargar Temas Base
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border-b-4 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#2D3436] text-base">
                Metas Programadas para Hoy
              </h3>
              <span className="text-xs font-bold text-[#4D96FF] bg-[#EBF3FF] px-3 py-1 rounded-full">
                {tasks.filter((t) => t.completed).length} de {tasks.length} completadas
              </span>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-8">
                  No hay metas asignadas. ¡Agrega una nueva arriba!
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                      task.completed
                        ? "bg-white border-slate-100 text-slate-400 opacity-70"
                        : "bg-[#F8FAFC] border-slate-100 text-[#2D3436] hover:border-[#4D96FF]"
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-[#6BCB77] transition-colors cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-[#6BCB77]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#4D96FF]">
                          {task.subject}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            task.priority === "Alta"
                              ? "bg-[#FFF5F5] text-[#FF6B6B]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Prioridad {task.priority}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-black ${
                          task.completed ? "line-through text-slate-400" : "text-[#2D3436]"
                        }`}
                      >
                        {task.topic}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.estimatedMinutes} minutos estimados</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Pomodoro Focus Timer */}
        <div
          ref={mainPomodoroRef}
          className="bg-[#4D96FF] rounded-3xl p-6 shadow-md border-b-4 border-blue-600 text-white text-center flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-white opacity-90 font-bold">
              <span className="uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Enfoque Pomodoro</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors cursor-pointer"
                  title={soundEnabled ? "Sonido activado" : "Sonido desactivado"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-red-200" />
                  )}
                </button>
                <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-black">
                  {mode === "study" ? "Bloque de Estudio" : "Descanso Corto"}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="py-6 my-2 bg-white rounded-2xl shadow-sm text-[#2D3436]">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-[#2D3436]">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-bold">
                {mode === "study" ? "Concentración en la meta seleccionada" : "¡Toma agua y estírate 5 minutos!"}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={toggleTimer}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                  isRunning
                    ? "bg-[#FFD93D] text-[#8B6E00]"
                    : "bg-[#2D3436] text-white"
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? "Pausar" : "Iniciar Sesión"}</span>
              </button>

              <button
                onClick={() => resetTimer(mode)}
                className="p-3.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-colors cursor-pointer"
                title="Reiniciar Temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Pomodoro Stats */}
            <div className="pt-2 text-xs text-white/90 font-bold flex items-center justify-center space-x-2">
              <Flame className="w-4 h-4 text-[#FFD93D]" />
              <span>Pomodoros completados hoy: <strong className="text-[#FFD93D] font-black">{completedPomodoros}</strong></span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 text-xs text-white/90 text-left font-medium mt-4">
            💡 <strong>Técnica comprobada:</strong> Estudia 25 minutos sin celular, descansa 5 minutos. Repite 4 veces.
          </div>
        </div>
      </div>

      {/* Floating Widget (Desktop & Mobile) when main Pomodoro is off-screen */}
      {showFloatingPomodoro && (
        <>
          {/* Desktop Floating Widget (Bottom-Right) */}
          <div className="hidden sm:flex fixed bottom-6 right-6 z-50 bg-[#2D3436]/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white flex-col gap-3 min-w-[290px] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  mode === "study" ? "bg-[#4D96FF] text-white" : "bg-[#6BCB77] text-white"
                }`}>
                  {mode === "study" ? "ENFOQUE 25M" : "DESCANSO 5M"}
                </span>
                {isRunning && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                  title={soundEnabled ? "Sonido activado" : "Sonido desactivado"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FFD93D]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  onClick={scrollToMainPomodoro}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Expandir a vista principal"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-3xl font-black font-mono tracking-wider text-[#FFD93D]">
                {formatTime(timerSeconds)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTimer}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                    isRunning ? "bg-[#FFD93D] text-[#8B6E00]" : "bg-[#4D96FF] text-white hover:bg-blue-600"
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? "Pausar" : "Iniciar"}</span>
                </button>

                <button
                  onClick={() => resetTimer(mode)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bottom Bar (Positioned above the fixed bottom navigation menu) */}
          <div className="flex sm:hidden fixed bottom-[58px] left-0 right-0 z-50 bg-[#2D3436]/95 backdrop-blur-md border-t border-slate-700/80 p-2.5 px-4 shadow-2xl text-white items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 bg-white/10 rounded-lg text-white"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FFD93D]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              <div>
                <span className={`text-[9px] font-black px-2 py-0.2 rounded-md block w-fit ${
                  mode === "study" ? "bg-[#4D96FF] text-white" : "bg-[#6BCB77] text-white"
                }`}>
                  {mode === "study" ? "ENFOQUE" : "DESCANSO"}
                </span>
                <span className="text-lg font-black font-mono tracking-wide text-[#FFD93D] block leading-tight">
                  {formatTime(timerSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimer}
                className={`px-3 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1 min-h-[38px] cursor-pointer ${
                  isRunning ? "bg-[#FFD93D] text-[#8B6E00]" : "bg-[#4D96FF] text-white"
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? "Pausar" : "Iniciar"}</span>
              </button>

              <button
                onClick={() => resetTimer(mode)}
                className="p-2 bg-white/10 rounded-xl text-slate-300 min-h-[38px] cursor-pointer"
                title="Reiniciar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={scrollToMainPomodoro}
                className="p-2 bg-white/10 rounded-xl text-slate-300 min-h-[38px] cursor-pointer"
                title="Ir al temporizador principal"
              >
                <ChevronUp className="w-4 h-4 text-[#FFD93D]" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl text-[#2D3436] border-b-4 border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#2D3436] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#4D96FF]" />
              <span>Agregar Nueva Meta de Estudio</span>
            </h3>

            <form onSubmit={handleAddNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Materia</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
                >
                  <option value="Matemáticas">Matemáticas y Razonamiento</option>
                  <option value="Lectura Crítica">Lectura Crítica / Verbal</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Biología">Biología</option>
                  <option value="Historia">Historia / Ciencias Sociales</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Tema / Objetivo Específico</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Resolver 10 ejercicios de Geometría Analítica"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] placeholder-slate-400 font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Prioridad</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-3.5 py-2 text-[#2D3436] font-semibold focus:outline-none focus:border-[#4D96FF] min-h-[40px]"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer min-h-[40px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white rounded-xl font-black shadow-md shadow-blue-500/20 cursor-pointer min-h-[40px]"
                >
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
