import React, { useState } from "react";
import { UserPlan, PlatformUser } from "../types";
import { GraduationCap, Calendar, Flame, Clock, HelpCircle, Settings, BookOpen, Target, Sparkles, Compass, Users, Database, Shield, LogOut, Globe, Menu, X, Download } from "lucide-react";

export type NavTab = "dashboard" | "planner" | "simulacro" | "agraria" | "questions" | "ai_tutor" | "users_admin" | "repo_admin" | "auth" | "landing" | "parent_portal";

interface HeaderProps {
  plan: UserPlan;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenOnboarding?: () => void;
  currentUser?: PlatformUser;
  pendingUsersCount?: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ plan, activeTab, setActiveTab, onOpenSettings, onOpenOnboarding, currentUser, pendingUsersCount = 0, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Calculate days remaining until exam safely
  const examDate = plan?.examDate ? new Date(plan.examDate) : new Date(Date.now() + 180 * 86400000);
  const now = new Date();
  const diffTime = isNaN(examDate.getTime()) ? 0 : examDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const targetUniversity = plan?.targetUniversity || "UNMSM";
  const targetCareer = plan?.targetCareer || "Medicina / Ingeniería";
  const currentStreak = plan?.currentStreakDays || 0;
  const dailyGoal = plan?.dailyStudyHoursGoal || 3;
  return (
    <>
      <header className="bg-white border-b-2 border-slate-100 text-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-2">
            {/* Brand & Target University info */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF6B6B] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-red-500/20">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-base sm:text-xl font-black tracking-tight text-[#2D3436]">
                    PREP<span className="text-[#4D96FF]">UP</span> <span className="text-xs sm:text-sm font-bold text-slate-400">Perú 🇵🇪</span>
                  </h1>
                  <span className="hidden xs:inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-black rounded-full bg-[#EBF3FF] text-[#4D96FF] border border-blue-200">
                    Preu
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 font-medium truncate max-w-[160px] sm:max-w-xs">
                  <span className="hidden sm:inline">Objetivo:</span>
                  <span className="font-bold text-[#2D3436] truncate">{targetUniversity}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#4D96FF] font-bold truncate">{targetCareer}</span>
                </p>
              </div>
            </div>

            {/* Key Quick Stats Pills & Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 text-xs">
              {/* Days Left Countdown */}
              <div className="hidden sm:flex items-center space-x-1.5 bg-[#EBF8FF] border border-blue-100 px-3 py-1.5 rounded-2xl text-slate-700 shadow-2xs">
                <Calendar className="w-4 h-4 text-[#4D96FF]" />
                <div>
                  <span className="font-black text-[#4D96FF] text-sm">{daysLeft}</span>
                  <span className="text-slate-500 ml-1 font-semibold">días faltan</span>
                </div>
              </div>

              {/* Streak Pill */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 bg-[#FFF3BF] px-2.5 sm:px-3.5 py-1.5 rounded-full text-slate-800 shadow-2xs">
                <Flame className="w-4 h-4 text-[#E67E22] shrink-0" />
                <div>
                  <span className="font-black text-[#E67E22] text-sm">{currentStreak}</span>
                  <span className="text-[#B76E00] font-bold ml-0.5 hidden xs:inline">días 🔥</span>
                </div>
              </div>

              {/* Goal Hours Pill */}
              <div className="hidden md:flex items-center space-x-1.5 bg-[#F1F3F5] border border-slate-200 px-3 py-1.5 rounded-2xl text-slate-700">
                <Clock className="w-4 h-4 text-[#6BCB77]" />
                <div>
                  <span className="font-black text-[#2D3436] text-sm">{dailyGoal}h</span>
                  <span className="text-slate-500 ml-1 font-medium">meta</span>
                </div>
              </div>

              {/* Onboarding Tour Button */}
              {onOpenOnboarding && (
                <button
                  onClick={onOpenOnboarding}
                  className="hidden sm:flex px-2.5 sm:px-3 py-2 bg-[#EBF3FF] hover:bg-blue-100 text-[#4D96FF] font-black rounded-xl text-xs items-center gap-1.5 transition-all border border-blue-200 cursor-pointer shadow-2xs hover:shadow-xs min-h-[38px]"
                  title="Ver Tour Guía"
                >
                  <Compass className="w-4 h-4 text-[#4D96FF]" />
                  <span>Tour</span>
                </button>
              )}

              {/* Public Landing Link */}
              <button
                onClick={() => setActiveTab("landing")}
                className="hidden md:flex px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs items-center space-x-1 transition-all border border-slate-200 cursor-pointer min-h-[38px]"
                title="Ir a la Landing Page Pública"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Inicio Público</span>
              </button>

              {/* Download ZIP Button */}
              <button
                onClick={handleDownloadZip}
                disabled={isDownloadingZip}
                className="hidden lg:flex px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 font-bold rounded-xl text-xs items-center space-x-1.5 transition-all border border-emerald-300 cursor-pointer min-h-[38px]"
                title="Descargar código fuente completo en un archivo .zip"
              >
                <Download className={`w-3.5 h-3.5 text-emerald-600 ${isDownloadingZip ? "animate-bounce" : ""}`} />
                <span>{isDownloadingZip ? "Descargando..." : "Descargar .ZIP"}</span>
              </button>

              {/* Settings Button */}
              <button
                onClick={onOpenSettings}
                className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Configurar Plan y Universidad"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Login / User Profile Pill Button */}
              {currentUser ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setActiveTab("auth")}
                    className={`px-3 py-1.5 rounded-2xl border text-xs flex items-center space-x-2 transition-all cursor-pointer min-h-[38px] shadow-2xs ${
                      currentUser.role === "admin"
                        ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
                        : currentUser.role === "parent"
                        ? "bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-900"
                        : currentUser.status === "activo"
                        ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900"
                        : "bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900"
                    }`}
                    title="Cambiar perfil de usuario"
                  >
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-black text-[11px] shadow-xs shrink-0">
                      {currentUser.role === "admin" ? "🛡️" : currentUser.role === "parent" ? "👨‍👩‍👦" : "🎓"}
                    </div>
                    <div className="text-left hidden xs:block">
                      <span className="font-black block truncate max-w-[100px] sm:max-w-[120px] leading-tight">
                        {currentUser.name.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-bold block opacity-80 uppercase tracking-wider">
                        {currentUser.role === "admin"
                          ? "Admin"
                          : currentUser.role === "parent"
                          ? "Apoderado"
                          : currentUser.status === "activo"
                          ? "Alumno"
                          : "Pendiente"}
                      </span>
                    </div>
                  </button>

                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="hidden sm:flex p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-all border border-slate-200 min-h-[38px] min-w-[38px] items-center justify-center cursor-pointer"
                      title="Cerrar Sesión e Ir a la Landing"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab("auth")}
                  className="px-3.5 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer min-h-[38px]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Login / Registro</span>
                </button>
              )}

              {/* Hamburger Toggle Button for Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 sm:hidden transition-colors border border-slate-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
                title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
                aria-label="Menú principal hamburguesa"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Hamburger Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-slate-200 py-3 px-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
                  Módulos de la Plataforma
                </span>

                {currentUser?.role === "parent" ? (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("parent_portal");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "parent_portal"
                          ? "bg-purple-700 text-white font-black"
                          : "bg-purple-50 text-purple-900 font-bold hover:bg-purple-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>Portal de Apoderados</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "dashboard"
                          ? "bg-[#4D96FF] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Target className="w-4 h-4" />
                        <span>Resumen del Alumno</span>
                      </div>
                    </button>
                  </>
                ) : currentUser?.role === "admin" ? (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("users_admin");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "users_admin"
                          ? "bg-[#2D3436] text-white font-black"
                          : "bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>Gestión de Usuarios</span>
                      </div>
                      {pendingUsersCount > 0 && (
                        <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {pendingUsersCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("repo_admin");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "repo_admin"
                          ? "bg-purple-700 text-white font-black"
                          : "bg-purple-50 text-purple-900 font-bold hover:bg-purple-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Database className="w-4 h-4 text-purple-600" />
                        <span>Banco de Preguntas</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "dashboard"
                          ? "bg-[#4D96FF] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Target className="w-4 h-4" />
                        <span>Mi Camino</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("planner");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "planner"
                          ? "bg-[#4D96FF] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Plan Diario</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("simulacro");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "simulacro"
                          ? "bg-[#FF6B6B] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <GraduationCap className="w-4 h-4" />
                        <span>Simulacros</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "dashboard"
                          ? "bg-[#4D96FF] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Target className="w-4 h-4" />
                        <span>Mi Camino</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("planner");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "planner"
                          ? "bg-[#4D96FF] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Plan Diario & Pomodoro</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("simulacro");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "simulacro"
                          ? "bg-[#FF6B6B] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <GraduationCap className="w-4 h-4" />
                        <span>Simulacros de Admisión</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("agraria");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "agraria"
                          ? "bg-[#6BCB77] text-white font-black"
                          : "bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span>🌿</span>
                        <span>Reto UNALM (Gamificado)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("ai_tutor");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "ai_tutor"
                          ? "bg-[#6BCB77] text-white font-black"
                          : "bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Tutor IA Explicador</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("questions");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === "questions"
                          ? "bg-[#FFD93D] text-[#8B6E00] font-black"
                          : "bg-amber-50 text-amber-900 font-bold hover:bg-amber-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <HelpCircle className="w-4 h-4 text-[#8B6E00]" />
                        <span>Preguntas Clave</span>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Quick Actions / Configuration */}
              <div className="border-t border-slate-100 pt-2 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
                  Acciones Rápidas
                </span>
                {onOpenOnboarding && (
                  <button
                    onClick={() => {
                      onOpenOnboarding();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#4D96FF] transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#4D96FF]" />
                    <span>Ver Tour Guía Interactivo</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveTab("landing");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Ir a Inicio Público</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span>Configurar Plan y Universidad</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDownloadZip();
                  }}
                  disabled={isDownloadingZip}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Download className={`w-4 h-4 text-emerald-600 ${isDownloadingZip ? "animate-bounce" : ""}`} />
                  <span>{isDownloadingZip ? "Descargando Código Fuente..." : "Descargar Código Fuente (.ZIP)"}</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop Navigation Tabs - Filtered by User Role */}
          <nav className="hidden sm:flex space-x-1.5 border-t border-slate-100 pt-2 pb-2 overflow-x-auto scrollbar-none">
            {currentUser?.role === "parent" ? (
              <>
                <button
                  onClick={() => setActiveTab("parent_portal")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "parent_portal"
                      ? "bg-purple-700 text-white font-black border-2 border-purple-900 shadow-md shadow-purple-900/30"
                      : "bg-purple-50/90 text-purple-900 font-bold border border-purple-200/90 hover:bg-purple-100"
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Portal de Apoderados</span>
                </button>

                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#4D96FF] text-white font-black border-2 border-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBF3FF] hover:text-[#4D96FF]"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Resumen del Alumno</span>
                </button>
              </>
            ) : currentUser?.role === "admin" ? (
              <>
                <button
                  onClick={() => setActiveTab("users_admin")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer relative ${
                    activeTab === "users_admin"
                      ? "bg-[#2D3436] text-white font-black border-2 border-slate-900 shadow-md shadow-slate-900/30"
                      : "bg-slate-100/90 text-slate-800 font-bold border border-slate-300/90 hover:bg-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Gestión de Usuarios</span>
                  {pendingUsersCount > 0 && (
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                      {pendingUsersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("repo_admin")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "repo_admin"
                      ? "bg-purple-700 text-white font-black border-2 border-purple-900 shadow-md shadow-purple-900/30"
                      : "bg-purple-50/90 text-purple-900 font-bold border border-purple-200/90 hover:bg-purple-100"
                  }`}
                >
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>Banco de Preguntas</span>
                </button>

                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#4D96FF] text-white font-black border-2 border-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBF3FF] hover:text-[#4D96FF]"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Mi Camino</span>
                </button>

                <button
                  onClick={() => setActiveTab("planner")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "planner"
                      ? "bg-[#4D96FF] text-white font-black border-2 border-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBF3FF] hover:text-[#4D96FF]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Plan Diario</span>
                </button>

                <button
                  onClick={() => setActiveTab("simulacro")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "simulacro"
                      ? "bg-[#FF6B6B] text-white font-black border-2 border-red-600 shadow-md shadow-red-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#FFF5F5] hover:text-[#FF6B6B]"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Simulacros</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#4D96FF] text-white font-black border-2 border-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBF3FF] hover:text-[#4D96FF]"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Mi Camino</span>
                </button>

                <button
                  onClick={() => setActiveTab("planner")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "planner"
                      ? "bg-[#4D96FF] text-white font-black border-2 border-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBF3FF] hover:text-[#4D96FF]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Plan Diario & Pomodoro</span>
                </button>

                <button
                  onClick={() => setActiveTab("simulacro")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "simulacro"
                      ? "bg-[#FF6B6B] text-white font-black border-2 border-red-600 shadow-md shadow-red-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#FFF5F5] hover:text-[#FF6B6B]"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Simulacros</span>
                </button>

                <button
                  onClick={() => setActiveTab("agraria")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "agraria"
                      ? "bg-[#6BCB77] text-white font-black border-2 border-emerald-600 shadow-md shadow-green-500/30"
                      : "bg-emerald-50/90 text-emerald-800 font-bold border border-emerald-200/90 shadow-2xs hover:bg-[#EBFBEE] hover:text-[#1E5627]"
                  }`}
                >
                  <span className="text-base">🌿</span>
                  <span>Reto UNALM</span>
                  <span className="bg-emerald-200/70 text-[#1E5627] text-[10px] font-black px-1.5 py-0.2 rounded-md">
                    Gamificado
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("ai_tutor")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "ai_tutor"
                      ? "bg-[#6BCB77] text-white font-black border-2 border-emerald-600 shadow-md shadow-green-500/30"
                      : "bg-slate-100/90 text-slate-700 font-bold border border-slate-200/90 shadow-2xs hover:bg-[#EBFBEE] hover:text-[#1E5627]"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Tutor IA Explicador</span>
                </button>

                <button
                  onClick={() => setActiveTab("questions")}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === "questions"
                      ? "bg-[#FFD93D] text-[#8B6E00] font-black border-2 border-amber-400 shadow-md shadow-yellow-500/30"
                      : "bg-amber-50/90 text-amber-900 font-bold border border-amber-200/90 shadow-2xs hover:bg-[#FFF3BF] hover:text-[#8B6E00]"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#8B6E00]" />
                  <span>Preguntas Clave</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Ergonomic Bottom Navigation Bar - Filtered by User Role */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 flex justify-around items-center shadow-lg">
        {currentUser?.role === "parent" ? (
          <>
            <button
              onClick={() => setActiveTab("parent_portal")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "parent_portal"
                  ? "text-purple-600 font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Users className="w-5 h-5 mb-0.5 text-purple-600" />
              <span className="text-[9px] tracking-tight">Portal</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "dashboard"
                  ? "text-[#4D96FF] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Target className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Resumen</span>
            </button>
          </>
        ) : currentUser?.role === "admin" ? (
          <>
            <button
              onClick={() => setActiveTab("users_admin")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] relative ${
                activeTab === "users_admin"
                  ? "text-indigo-600 font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Usuarios</span>
              {pendingUsersCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("repo_admin")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "repo_admin"
                  ? "text-purple-600 font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Database className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Banco</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "dashboard"
                  ? "text-[#4D96FF] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Target className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Camino</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "planner"
                  ? "text-[#4D96FF] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <BookOpen className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Plan</span>
            </button>

            <button
              onClick={() => setActiveTab("simulacro")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "simulacro"
                  ? "text-[#FF6B6B] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Simulacro</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "dashboard"
                  ? "text-[#4D96FF] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Target className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Camino</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "planner"
                  ? "text-[#4D96FF] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <BookOpen className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Plan</span>
            </button>

            <button
              onClick={() => setActiveTab("simulacro")}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-h-[44px] ${
                activeTab === "simulacro"
                  ? "text-[#FF6B6B] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] tracking-tight">Simulacro</span>
            </button>

            <button
              onClick={() => setActiveTab("agraria")}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[44px] ${
                activeTab === "agraria"
                  ? "text-[#6BCB77] font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <span className="text-base mb-0.5 leading-none">🌿</span>
              <span className="text-[9px] tracking-tight">UNALM</span>
            </button>

            <button
              onClick={() => setActiveTab("ai_tutor")}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[44px] ${
                activeTab === "ai_tutor"
                  ? "text-emerald-600 font-black scale-105"
                  : "text-slate-500 font-medium"
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5 text-amber-500" />
              <span className="text-[9px] tracking-tight">Tutor IA</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
