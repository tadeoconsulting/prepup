import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  Award,
  Flame,
  Zap,
  Rocket,
  ShieldCheck
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExploring: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartExploring,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: 1,
      badge: "SLIDE 1 DE 3 • UNIVERSIDADES DE PERÚ",
      badgeBg: "bg-[#FFD93D]",
      badgeText: "text-[#8B6E00]",
      title: "Plan de Admisión Personalizado para Perú 🇵🇪",
      subtitle:
        "Prepárate para la UNMSM (San Marcos), UNI, PUCP, UNALM, UNSA, UNT y más con un plan a tu medida.",
      colorAccent: "#4D96FF",
      icon: GraduationCap,
      features: [
        {
          title: "Modelos Específicos de Examen",
          desc: "Preguntas tipo DECO® para San Marcos, nivel avanzado para la UNI o pruebas de talento para la PUCP.",
          icon: Target,
          iconBg: "bg-[#EBF3FF] text-[#4D96FF]",
        },
        {
          title: "Planes de 2 a 12 Meses",
          desc: "Adapta el tiempo de preparación según la fecha fijada para tu examen de admisión.",
          icon: Clock,
          iconBg: "bg-[#EBFBEE] text-[#6BCB77]",
        },
        {
          title: "Seguimiento de Metas y Rachas",
          desc: "Monitorea tus horas diarias acumuladas y mantiene viva tu racha de días de estudio.",
          icon: Flame,
          iconBg: "bg-[#FFF3BF] text-[#E67E22]",
        },
      ],
      previewCard: (
        <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#2D3436] flex items-center gap-1.5">
              <span>🇵🇪</span> UNMSM - San Marcos (DECO®)
            </span>
            <span className="bg-[#EBF3FF] text-[#4D96FF] text-[10px] font-black px-2.5 py-0.5 rounded-full">
              Meta: 3h / día
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block">Cuenta Regresiva</span>
              <span className="text-sm font-black text-[#4D96FF]">180 Días</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block">Racha Activa</span>
              <span className="text-sm font-black text-[#E67E22] flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#FFD93D]" /> 12 Días
              </span>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">Avance de Horas</span>
            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#6BCB77] h-full w-[65%] rounded-full"></div>
            </div>
            <span className="font-black text-[#6BCB77]">65%</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: "SLIDE 2 DE 3 • SIMULACROS EN VIVO",
      badgeBg: "bg-[#FF6B6B]",
      badgeText: "text-white",
      title: "Simulacros Tipo Examen Real con Calificación e IA",
      subtitle:
        "Practica con preguntas situacionales cronometradas y recibe retroalimentación explicada paso a paso.",
      colorAccent: "#FF6B6B",
      icon: Award,
      features: [
        {
          title: "Práctica Situacional Relevante",
          desc: "Preguntas contextualizadas en problemáticas reales con opciones A, B, C, D.",
          icon: Zap,
          iconBg: "bg-[#FFF5F5] text-[#FF6B6B]",
        },
        {
          title: "Explicación del Profesor Paso a Paso",
          desc: "Entiende la lógica detrás de cada respuesta correcta y evita trampas habituales.",
          icon: CheckCircle2,
          iconBg: "bg-[#EBFBEE] text-[#6BCB77]",
        },
        {
          title: "Generador de Simulacros con IA",
          desc: "Crea exámenes ilimitados en el tema o materia que desees reforzar.",
          icon: Sparkles,
          iconBg: "bg-[#FFF3BF] text-[#8B6E00]",
        },
      ],
      previewCard: (
        <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-[#2D3436]">Pregunta 1 de 5 • DECO®</span>
            <span className="bg-[#FFF5F5] text-[#FF6B6B] font-black px-2.5 py-0.5 rounded-full text-[10px]">
              Física y Vectorial
            </span>
          </div>
          <p className="text-xs font-bold text-[#2D3436] leading-snug">
            Un móvil parte del reposo con MRUV en una vía inclinada de 30°...
          </p>
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded-xl bg-[#EBF3FF] border border-[#4D96FF] font-black text-[#4D96FF] flex items-center justify-between">
              <span>A) 15 m/s²</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 font-semibold">
              B) 25 m/s²
            </div>
          </div>
          <div className="bg-[#EBFBEE] p-2.5 rounded-xl border border-[#6BCB77] text-[11px] text-[#1E5627] font-medium">
            💡 <strong>Profesor IA:</strong> Aplicando la 2da Ley de Newton F=m·a...
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: "SLIDE 3 DE 3 • TUTOR IA Y ENFOQUE",
      badgeBg: "bg-[#6BCB77]",
      badgeText: "text-white",
      title: "Tutor IA 24/7 y Pomodoro de Concentración",
      subtitle:
        "Resuelve ejercicios difíciles al instante y estudia con la técnica de bloques de tiempo probada.",
      colorAccent: "#6BCB77",
      icon: Sparkles,
      features: [
        {
          title: "Tutor Explicador IA Integrado",
          desc: "Pregunta cualquier duda de Matemáticas, Razonamiento o Ciencias y obtén soluciones guiadas.",
          icon: Sparkles,
          iconBg: "bg-[#FFF3BF] text-[#8B6E00]",
        },
        {
          title: "Temporizador Pomodoro Anti-Distracción",
          desc: "Trabaja en bloques de 25 minutos de enfoque total con descansos de 5 minutos.",
          icon: Clock,
          iconBg: "bg-[#EBF3FF] text-[#4D96FF]",
        },
        {
          title: "Metas Diarias Personalizables",
          desc: "Crea y tacha tus objetivos diarios para llegar 100% preparado a tu examen.",
          icon: BookOpen,
          iconBg: "bg-[#EBFBEE] text-[#6BCB77]",
        },
      ],
      previewCard: (
        <div className="bg-[#4D96FF] rounded-2xl p-4 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Bloque de Estudio
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">
              Pomodoro #3
            </span>
          </div>
          <div className="bg-white rounded-xl py-3 text-center text-[#2D3436]">
            <span className="text-3xl font-black font-mono tracking-wider">25:00</span>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">Enfoque Máximo en Álgebra</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl text-[11px] font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFD93D] shrink-0" />
            <span>¡3 Pomodoros completados hoy! Mantén el ritmo.</span>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onStartExploring();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border-b-4 border-slate-300 shadow-2xl max-w-2xl w-full p-4 sm:p-8 space-y-3 sm:space-y-6 relative text-[#2D3436] animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[90vh] overflow-y-auto">
        {/* Close / Skip button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-[#2D3436] hover:bg-slate-100 transition-colors cursor-pointer z-10"
          title="Cerrar Onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header & Progress Dots */}
        <div className="space-y-2 sm:space-y-3 pr-6 sm:pr-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${slide.badgeBg} ${slide.badgeText}`}>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{slide.badge}</span>
            </div>
            {/* Step Indicators */}
            <div className="flex items-center space-x-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide
                      ? "w-6 sm:w-8 bg-[#4D96FF]"
                      : "w-2 sm:w-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-base sm:text-2xl font-black text-[#2D3436] tracking-tight leading-snug">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-normal">
            {slide.subtitle}
          </p>
        </div>

        {/* Body content: Features list (Left) + Visual Card Preview (Right, hidden on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-center pt-1 sm:pt-2">
          {/* Features Column */}
          <div className="md:col-span-7 space-y-2 sm:space-y-3.5">
            {slide.features.map((feat, fIdx) => {
              const IconComp = feat.icon;
              return (
                <div key={fIdx} className="flex items-start gap-2.5 sm:gap-3 bg-[#F8FAFC] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100">
                  <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-black shrink-0 ${feat.iconBg}`}>
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#2D3436]">{feat.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Preview Column - Hidden on mobile as requested */}
          <div className="hidden md:block md:col-span-5">
            {slide.previewCard}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-5">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-[#2D3436] disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2.5 sm:px-3 py-2 cursor-pointer transition-colors"
            >
              Omitir
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black text-xs px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer uppercase tracking-wider min-h-[40px]"
            >
              <span>{currentSlide === slides.length - 1 ? "¡Empezar!" : "Siguiente"}</span>
              {currentSlide === slides.length - 1 ? (
                <Rocket className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
