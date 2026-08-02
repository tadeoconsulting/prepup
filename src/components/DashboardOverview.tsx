import React from "react";
import { UserPlan, DailyTask, SubjectProgress } from "../types";
import {
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  BarChart2,
  ArrowUpRight,
  Zap,
} from "lucide-react";

interface DashboardOverviewProps {
  plan: UserPlan;
  tasks: DailyTask[];
  onStartStudyTask: (task: DailyTask) => void;
  onGoToSimulacro: () => void;
  onOpenAITutor: () => void;
  onGoToAgraria?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  plan,
  tasks = [],
  onStartStudyTask,
  onGoToSimulacro,
  onOpenAITutor,
  onGoToAgraria,
}) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedCount = safeTasks.filter((t) => t?.completed).length;
  const totalTasks = safeTasks.length || 1;
  const todayProgressPercent = Math.round((completedCount / totalTasks) * 100);

  // Safe Date Formatting helper
  const formatDate = (dateStr?: string, options?: Intl.DateTimeFormatOptions) => {
    try {
      if (!dateStr) return new Date().toLocaleDateString("es-ES", options);
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date().toLocaleDateString("es-ES", options);
      return d.toLocaleDateString("es-ES", options);
    } catch {
      return new Date().toLocaleDateString("es-ES", options);
    }
  };

  // Subject mastery progress data with Vibrant Palette colors
  const subjectsProgress: SubjectProgress[] = [
    { subject: "Matemáticas y Razonamiento", masteryPercentage: 74, completedTasks: 28, totalTasks: 35, color: "bg-[#4D96FF]" },
    { subject: "Lectura Crítica / Verbal", masteryPercentage: 88, completedTasks: 31, totalTasks: 35, color: "bg-[#6BCB77]" },
    { subject: "Física y Química", masteryPercentage: 58, completedTasks: 18, totalTasks: 30, color: "bg-[#FF6B6B]" },
    { subject: "Biología y Anatomía", masteryPercentage: 65, completedTasks: 19, totalTasks: 28, color: "bg-[#FFD93D]" },
    { subject: "Historia y Ciencias Sociales", masteryPercentage: 82, completedTasks: 25, totalTasks: 30, color: "bg-[#9B51E0]" },
  ];

  // Estimated Readiness Index
  const streak = plan?.currentStreakDays || 0;
  const readinessIndex = Math.min(98, Math.round(72 + streak * 0.8));
  const totalMinutes = plan?.totalStudyMinutes || 0;
  const dailyHours = plan?.dailyStudyHoursGoal || 3;
  const durationMonths = plan?.durationMonths || 6;
  const studentName = plan?.studentName || "Estudiante";
  const targetUniv = plan?.targetUniversity || "Universidad";
  const targetCareer = plan?.targetCareer || "Carrera";

  return (
    <div className="space-y-6 text-[#2D3436]">
      {/* Main Grid: Today Card & Side Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Middle Column: Today Card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-b-4 border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#EBF3FF] text-[#4D96FF] px-3 py-1 rounded-full text-xs font-black">
                    Plan de {durationMonths} Meses
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    Iniciado: {formatDate(plan?.startDate, { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-[#2D3436] tracking-tight">
                  ¡Hola, {studentName}! 👋
                </h2>
                <p className="text-slate-500 mt-1 font-medium text-sm">
                  Hoy toca enfocarse en <span className="text-[#4D96FF] font-black">{targetUniv}</span> ({targetCareer}).
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black bg-[#FFD93D] text-[#8B6E00] px-4 py-2 rounded-2xl shadow-xs inline-block capitalize">
                  {formatDate(undefined, { weekday: "long", day: "numeric", month: "short" })}
                </span>
              </div>
            </div>

            {/* Daily Tasks List in Main Card */}
            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 mb-2">
                Tareas Recomendadas para Hoy
              </h3>
              {safeTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl transition-all ${
                    task.completed
                      ? "border-slate-100 bg-white"
                      : "border-slate-100 hover:border-[#4D96FF] bg-[#F8FAFC]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      task.completed
                        ? "bg-[#4D96FF] text-white"
                        : "border-2 border-[#4D96FF] bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-sm ${task.completed ? "text-slate-400 line-through" : "text-[#2D3436]"}`}>
                      {task.topic}
                    </p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {task.subject} • {task.estimatedMinutes} min
                    </p>
                  </div>
                  {!task.completed ? (
                    <button
                      onClick={() => onStartStudyTask(task)}
                      className="bg-[#4D96FF] hover:bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer shrink-0 min-h-[44px] flex items-center justify-center"
                    >
                      EMPEZAR
                    </button>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                      Completado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Preview Row (Vibrant Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#FFD93D] rounded-3xl p-6 shadow-sm border-b-4 border-amber-300">
              <h3 className="text-xs font-black uppercase text-[#8B6E00] tracking-wider">Índice de Preparación</h3>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-4xl font-black text-[#2D3436]">{readinessIndex}%</p>
                <span className="text-xs font-bold text-[#8B6E00] mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Nivel Óptimo
                </span>
              </div>
              <p className="text-xs text-[#8B6E00] font-semibold mt-2">
                Por encima del corte estimado para {targetCareer}.
              </p>
            </div>

            <div className="bg-[#4D96FF] rounded-3xl p-6 shadow-sm text-white border-b-4 border-blue-600">
              <h3 className="text-xs font-black uppercase opacity-90 tracking-wider">Horas de Estudio Acumuladas</h3>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-4xl font-black">{Math.round(totalMinutes / 60)}h</p>
                <span className="text-xs font-bold mb-1.5 italic bg-white/20 px-2.5 py-0.5 rounded-full">
                  Meta: {dailyHours}h / día
                </span>
              </div>
              <p className="text-xs opacity-90 font-semibold mt-2">
                ¡{streak} días de racha constante! 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Next Mock Exam & Subject Mastery Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Next Mock Exam Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-[#FF6B6B]">
            <h2 className="font-black text-lg mb-3 text-[#2D3436] flex items-center justify-between">
              <span>PRÓXIMO SIMULACRO</span>
              <Award className="w-5 h-5 text-[#FF6B6B]" />
            </h2>
            <div className="bg-[#FFF5F5] p-5 rounded-2xl border border-red-100">
              <p className="text-xs font-black text-[#FF6B6B] mb-1 uppercase tracking-wider">Simulacro Tipo Real</p>
              <p className="font-black text-xl text-[#2D3436]">{plan.targetUniversity}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">100 preguntas • Preguntas oficiales</p>
              <button
                onClick={onGoToSimulacro}
                className="w-full mt-4 bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] py-2.5 rounded-xl font-black hover:bg-[#FF6B6B] hover:text-white transition-all shadow-xs cursor-pointer text-xs uppercase"
              >
                Inscribirme y Rendir
              </button>
            </div>
          </div>

          {/* Banner Reto Agraria UNALM */}
          {onGoToAgraria && (
            <div className="bg-[#EBFBEE] border-2 border-[#6BCB77] rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="bg-[#6BCB77] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ¡NUEVO! GAMIFICACIÓN UNALM
                </span>
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <h3 className="font-black text-[#2D3436] text-sm">
                  Reto Agraria: Examen Resuelto
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                  Entrena con las preguntas resueltas del examen de admisión de La Agraria, gana puntos XP y desbloquea insignias.
                </p>
              </div>
              <button
                onClick={onGoToAgraria}
                className="w-full py-2.5 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <span>Entrar al Desafío</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Profile Analysis Box (Dark Charcoal Card with Vibrant Progress Bars) */}
          <div className="bg-[#2D3436] rounded-3xl p-6 shadow-lg flex-1 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-lg tracking-wide">ANÁLISIS DE PERFIL</h2>
                <button
                  onClick={onOpenAITutor}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors text-slate-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD93D]" />
                  <span>Pedir Tutor IA</span>
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                {subjectsProgress.map((subject) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300 uppercase">{subject.subject}</span>
                      <span className="font-black">{subject.masteryPercentage}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`${subject.color} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${subject.masteryPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-[#FFD93D] tracking-wider">Recomendación Personalizada</p>
                <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                  "Refuerza Física y Química esta semana para asegurar tu vacante en {plan.targetCareer} de {plan.targetUniversity}."
                </p>
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#4D96FF] rounded-full opacity-20 blur-2xl pointer-events-none"></div>
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#FF6B6B] rounded-full opacity-20 blur-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
