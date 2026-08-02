import React, { useState, useEffect } from "react";
import { PlatformUser, UniversityItem, ParentNotification } from "../types";
import {
  GraduationCap,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Mail,
  Send,
  BellRing,
  BookOpen,
  Target,
  BarChart3,
  Calendar,
  Clock,
  HeartHandshake,
  Award,
  Search,
  Check,
  Star,
  Menu,
  X
} from "lucide-react";

interface LandingPageProps {
  universities: UniversityItem[];
  students: PlatformUser[];
  onOpenLogin: (role?: "student" | "admin" | "parent") => void;
  onOpenRegister: () => void;
  onSendParentNotification: (studentId: string, notif: ParentNotification) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  universities,
  students,
  onOpenLogin,
  onOpenRegister,
  onSendParentNotification,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Scroll detection state for header & bottom floating bar
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 15) {
        setScrollDirection("up");
      } else if (currentScrollY > lastScrollY + 8) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY - 8) {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance hero slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#2D3436]">
      {/* Sticky Header Wrapper with Scroll Direction Animation */}
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ease-in-out ${
          scrollDirection === "down" ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
      >
        {/* Top Announcement Bar - Hidden on Mobile */}
        <div className="hidden sm:flex bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-2.5 px-4 text-center font-medium border-b border-indigo-900/50 items-center justify-center space-x-2">
          <span className="bg-[#4D96FF] text-white font-black px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            Nuevo 2026
          </span>
          <span>
            Acompañamiento personalizado + Seguimiento semanal por email para Padres y Apoderados
          </span>
        </div>

        {/* Navigation Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 bg-gradient-to-tr from-[#4D96FF] to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-xl">
                P
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-xl tracking-tight text-slate-800">PrepUp</span>
                  <span className="text-[10px] font-black bg-blue-100 text-[#4D96FF] px-1.5 py-0.5 rounded-md uppercase">
                    Perú
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 tracking-tight">
                  Acompañamiento Preuniversitario Integral
                </p>
              </div>
            </div>

            {/* Desktop Center Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600">
              <a href="#hero" className="hover:text-[#4D96FF] transition-colors py-2">Acompañamiento</a>
              <a href="#padres" className="hover:text-[#4D96FF] transition-colors py-2 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Para Padres</span>
              </a>
              <a href="#metodo" className="hover:text-[#4D96FF] transition-colors py-2">Método & IA</a>
              <a href="#universidades" className="hover:text-[#4D96FF] transition-colors py-2">Universidades</a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-2.5">
              <button
                onClick={() => onOpenLogin()}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 min-h-[44px]"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs font-black text-white bg-[#4D96FF] hover:bg-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center space-x-1.5 min-h-[44px]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Registro Alumno</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-lg">
              <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
                <a
                  href="#hero"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all flex items-center space-x-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#4D96FF]" />
                  <span>Acompañamiento del Estudiante</span>
                </a>
                <a
                  href="#padres"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all flex items-center space-x-2"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Monitoreo para Padres</span>
                </a>
                <a
                  href="#metodo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Método y Tutoría IA</span>
                </a>
                <a
                  href="#universidades"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Universidades de Perú</span>
                </a>
              </nav>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[44px]"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Iniciar Sesión</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full py-3 text-xs font-black text-white bg-[#4D96FF] hover:bg-blue-600 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[44px] shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Crear Cuenta</span>
                </button>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* HERO CAROUSEL SECTION */}
      <section id="hero" className="relative bg-slate-900 text-white overflow-hidden min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-80px)] flex flex-col justify-start py-6 sm:py-8 lg:py-10">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4D96FF]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6BCB77]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-start space-y-4 sm:space-y-6">
          {/* Slide Switcher Controls Top (Hidden on mobile) */}
          <div className="hidden sm:flex sm:flex-row sm:items-center justify-between mb-2 pb-4 border-b border-slate-800 gap-3">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(0)}
                className={`py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[44px] ${
                  currentSlide === 0
                    ? "bg-[#4D96FF] text-white shadow-lg ring-2 ring-blue-400/30"
                    : "bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span className="truncate">1. Acompañamiento Alumno</span>
              </button>

              <button
                onClick={() => setCurrentSlide(1)}
                className={`py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[44px] ${
                  currentSlide === 1
                    ? "bg-[#6BCB77] text-white shadow-lg ring-2 ring-emerald-400/30"
                    : "bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">2. Monitoreo Padres</span>
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-2 text-slate-400 text-xs">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center text-white"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold px-1 hidden sm:inline">{currentSlide + 1} / 2</span>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center text-white"
                  aria-label="Siguiente slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* SLIDE 1 CONTENT: ESTUDIANTE ACOMPAÑAMIENTO Y CONSTANCIA */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start animate-fade-in py-2">
              <div className="lg:col-span-7 space-y-6">
                <div className="hidden sm:inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>El Acompañamiento Diario que Transforma tu Preparación</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Constancia, Disciplina y Guía Diaria para Lograr tu{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4D96FF] via-sky-300 to-[#6BCB77]">
                    Vacante Soñada
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal hidden sm:block">
                  Ingresar a la universidad requiere más que teoría: requiere una rutina constante, simulacros con cronómetro real por admisión (UNMSM, UNI, PUCP, UNALM) y un Tutor IA que te explica paso a paso dónde te equivocaste.
                </p>

                {/* Key Features Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center space-x-2.5">
                    <Target className="w-5 h-5 text-[#4D96FF] shrink-0" />
                    <div>
                      <span className="block font-bold text-xs">Planes Diarios</span>
                      <span className="block text-[10px] text-slate-400">Anti-procrastinación</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center space-x-2.5">
                    <BookOpen className="w-5 h-5 text-[#6BCB77] shrink-0" />
                    <div>
                      <span className="block font-bold text-xs">Simulacros Reales</span>
                      <span className="block text-[10px] text-slate-400">Puntajes ponderados</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center space-x-2.5 col-span-2 sm:col-span-1">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-xs">Tutor IA 24/7</span>
                      <span className="block text-[10px] text-slate-400">Resolución guiada</span>
                    </div>
                  </div>
                </div>

                {/* Call to Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={onOpenRegister}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center text-sm min-h-[44px]"
                  >
                    <span>Crear Cuenta de Alumno</span>
                  </button>

                  <button
                    onClick={() => onOpenLogin("student")}
                    className="hidden sm:inline-flex items-center justify-center px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all cursor-pointer text-sm min-h-[44px]"
                  >
                    <span>Ingresar con Alumno Demo</span>
                  </button>
                </div>
              </div>

              {/* Visual Card / Mockup Right (Hidden on mobile) */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Panel de Avance del Postulante</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Santiago Mendoza (Medicina Humana - UNMSM)</span>
                      <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        Nivel Cachimbo 🚀
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                        <span>Constancia de Estudio Semanal</span>
                        <span className="text-emerald-400 font-bold">88% completado</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[88%]"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="block text-lg font-black text-amber-400">78.5%</span>
                        <span className="text-[10px] text-slate-400">Promedio Simulacros</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="block text-lg font-black text-[#4D96FF]">6 / 6</span>
                        <span className="text-[10px] text-slate-400">Exámenes Resueltos</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-2xl text-xs flex items-center space-x-3 text-blue-200">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-[11px] leading-snug font-medium">
                      "PrepUp me ayudó a organizar mis horas de estudio diario y medir mi puntaje real para San Marcos."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 CONTENT: PADRES Y TUTORES - SEGUIMIENTO Y NOTIFICACIONES */}
          {currentSlide === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start animate-fade-in py-2">
              <div className="lg:col-span-7 space-y-6">
                <div className="hidden sm:inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-emerald-300 font-bold text-xs">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Beneficio Exclusivo para Padres y Apoderados</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Tranquilidad Familiar:{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCB77] via-emerald-300 to-[#4D96FF]">
                    Monitorea el Progreso de tu Hijo
                  </span>{" "}
                  en Tiempo Real
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal hidden sm:block">
                  Los padres son piezas clave en el ingreso preuniversitario. Con PrepUp, recibes reportes semanales por correo electrónico con métricas claras, asistencia a sus tareas y puntajes de simulacros sin interrumpir su concentrada rutina de estudio.
                </p>

                {/* Key Benefits for Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-[#6BCB77] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-xs text-white">Reportes Automáticos por Email</span>
                      <span className="block text-[11px] text-slate-400">Resumen semanal de asistencia y exámenes</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-start space-x-3">
                    <BarChart3 className="w-5 h-5 text-[#4D96FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-xs text-white">Portal Directo de Apoderado</span>
                      <span className="block text-[11px] text-slate-400">Visualiza el avance sin cambiar su cuenta</span>
                    </div>
                  </div>
                </div>

                {/* Call to Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <a
                    href="#padres"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center text-sm min-h-[44px]"
                  >
                    <span>Ver Demostración del Portal de Padres</span>
                  </a>

                  <button
                    onClick={() => onOpenLogin("parent")}
                    className="hidden sm:inline-flex items-center justify-center px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all cursor-pointer text-sm min-h-[44px]"
                  >
                    <span>Acceso Apoderado Demo</span>
                  </button>
                </div>
              </div>

              {/* Visual Card Right for Parent Slide (Hidden on mobile) */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-emerald-300">Vista de Email Enviado al Padre</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                      ENVIADO ✉️
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="text-xs space-y-1">
                      <p className="text-slate-400 text-[10px]">Para: roberto.mendoza@gmail.com</p>
                      <p className="font-black text-white text-xs">
                        📊 Reporte PrepUp: Avance y Constancia de Santiago Mendoza
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-[11px] text-slate-300">
                      <p>
                        Estimado Sr. Roberto Mendoza, le informamos el progreso semanal de <strong>Santiago</strong>:
                      </p>
                      <ul className="space-y-1 list-disc list-inside text-emerald-300 font-medium">
                        <li>Simulacros UNMSM completados: 6 ex.</li>
                        <li>Promedio actual: 78.5% (En zona de vacante)</li>
                        <li>Cumplimiento diario de tareas: 85%</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl flex items-center space-x-3">
                    <HeartHandshake className="w-6 h-6 text-emerald-400 shrink-0" />
                    <p className="text-[11px] text-emerald-200 leading-tight">
                      Manten la tranquilidad sabiendo exactamente el esfuerzo diario de tu hijo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide Pagination Bullets at Bottom of Hero */}
          <div className="mt-8 pt-4 flex flex-col items-center justify-center space-y-2 border-t border-slate-800/60">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCurrentSlide(0)}
                aria-label="Diapositiva 1: Acompañamiento del Alumno"
                className="p-2.5 cursor-pointer focus:outline-none flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    currentSlide === 0
                      ? "w-8 h-3 bg-[#4D96FF] shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/40"
                      : "w-3 h-3 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setCurrentSlide(1)}
                aria-label="Diapositiva 2: Monitoreo para Padres"
                className="p-2.5 cursor-pointer focus:outline-none flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    currentSlide === 1
                      ? "w-8 h-3 bg-[#6BCB77] shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400/40"
                      : "w-3 h-3 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              </button>
            </div>

            <div className="text-[11px] font-bold text-slate-400 flex items-center space-x-1.5">
              <span>Diapositiva {currentSlide + 1} de 2:</span>
              <span className={currentSlide === 0 ? "text-[#4D96FF] font-black" : "text-[#6BCB77] font-black"}>
                {currentSlide === 0 ? "1. Acompañamiento del Alumno" : "2. Monitoreo para Padres"}
              </span>
            </div>

            {/* Scroll Down Indicator */}
            <a
              href="#padres"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("padres")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="pt-2 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors gap-1 group cursor-pointer"
              aria-label="Desplazarse hacia abajo"
            >
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 group-hover:text-blue-300">
                Desliza para ver más
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce text-[#4D96FF]" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION: PORTAL DE PADRES Y MONITOREO */}
      <section id="padres" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Portal de Monitoreo para Padres y Apoderados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Mantén el control del progreso de tu hijo con reportes automáticos y métricas transparentes sin interrumpir sus horas de estudio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">
                📬
              </div>
              <h3 className="font-black text-base text-slate-900">Reportes Semanales por Correo</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Recibe resúmenes automáticos con los puntajes de simulacros, cumplimiento de tareas y constancia del postulante directamente en tu e-mail.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-[#4D96FF] rounded-2xl flex items-center justify-center font-black text-xl">
                📊
              </div>
              <h3 className="font-black text-base text-slate-900">Métricas de Consistencia</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Visualiza el avance del temario, porcentaje de aciertos por materia y evolución histórica comparada con los puntajes mínimos de ingreso.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-black text-xl">
                🔔
              </div>
              <h3 className="font-black text-base text-slate-900">Alertas de Acompañamiento</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Notificaciones oportunistas cuando se detecte baja frecuencia de estudio o retraso en las tareas para poder apoyarlo a tiempo.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onOpenLogin("parent")}
              className="px-6 py-3 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center space-x-2 min-h-[44px]"
            >
              <Users className="w-4 h-4" />
              <span>Acceso Demo para Padres</span>
            </button>
          </div>
        </div>
      </section>

      {/* METHOD & FEATURES SECTION */}
      <section id="metodo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-blue-100 text-blue-800 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            ¿Por qué elegir PrepUp?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Un método diseñado para asegurar la constancia y el ingreso
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Combinamos tecnología inteligente, simulacros ponderados y un canal directo para la familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-[#4D96FF] rounded-2xl flex items-center justify-center font-black text-xl">
              🎯
            </div>
            <h3 className="font-black text-base text-slate-900">1. Planificador Anti-Procrastinación</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Bloques de estudio optimizados por día, divididos en repaso conceptual, ejercicios prácticos y simulacros cronometrados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-[#6BCB77] rounded-2xl flex items-center justify-center font-black text-xl">
              📝
            </div>
            <h3 className="font-black text-base text-slate-900">2. Simulacros por Universidad</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Exámenes diseñados respetando las ponderaciones de San Marcos (UNMSM), UNI, PUCP y Agraria La Molina.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xl">
              🤖
            </div>
            <h3 className="font-black text-base text-slate-900">3. Tutor IA con Método Socrático</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Te ayuda a detectar en qué paso del problema cometiste un error y te explica el fundamento paso a paso.
            </p>
          </div>
        </div>
      </section>

      {/* UNIVERSITIES LIST SECTION */}
      <section id="universidades" className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Preparación Especializada para Perú
            </span>
            <h2 className="text-2xl font-black">
              Banco de Preguntas y Simulacros para las Principales Universidades
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center space-y-2 transition-all cursor-pointer"
                onClick={() => onOpenRegister()}
              >
                <div className="text-3xl">{uni.logoEmoji}</div>
                <span className="font-black text-xs block text-slate-200">{uni.shortName}</span>
                <span className="text-[10px] text-slate-400 block truncate">{uni.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#4D96FF] text-white rounded-xl flex items-center justify-center font-black text-lg">
              P
            </div>
            <div>
              <span className="font-black text-white text-sm block">PrepUp Perú</span>
              <p className="text-[11px]">Plataforma de Acompañamiento Preuniversitario con Control de Apoderados.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenLogin()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl transition-all cursor-pointer shadow-md"
            >
              Crear Cuenta
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mt-8 border-t border-slate-900 text-[10px] text-slate-500 pb-16 md:pb-0">
          © 2026 PrepUp Inc. Todos los derechos reservados. Diseñado para postulantes a UNMSM, UNI, PUCP, UNALM y Cayetano.
        </div>
      </footer>

      {/* Floating Mobile Action Bar - Shows when scrolling DOWN, hides when scrolling UP */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex md:hidden items-center justify-between gap-2 z-50 transition-all duration-300 ease-in-out ${
          scrollDirection === "down"
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => onOpenLogin()}
          className="flex-1 py-3 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 min-h-[44px]"
        >
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Ingresar</span>
        </button>

        <button
          onClick={onOpenRegister}
          className="flex-1 py-3 px-3 text-xs font-black text-white bg-[#4D96FF] hover:bg-blue-600 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 min-h-[44px] shadow-md"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Registrar Alumno</span>
        </button>
      </div>
    </div>
  );
};
