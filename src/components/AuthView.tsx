import React, { useState } from "react";
import { PlatformUser, UserRole, UserStatus, UniversityItem } from "../types";
import {
  Shield,
  GraduationCap,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Building,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  X,
  Users
} from "lucide-react";

interface AuthViewProps {
  users: PlatformUser[];
  universities: UniversityItem[];
  onLogin: (user: PlatformUser) => void;
  onRegisterStudent: (newStudent: Omit<PlatformUser, "id" | "registeredAt" | "simulacrosCompletedCount" | "averageScorePercentage" | "lastActive">) => PlatformUser;
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  users,
  universities,
  onLogin,
  onRegisterStudent,
  onCancel,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginRole, setLoginRole] = useState<UserRole>("student");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUniversity, setRegUniversity] = useState(universities[0]?.name || "UNMSM (San Marcos)");
  const [regCareer, setRegCareer] = useState("Medicina Humana");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === emailClean && u.role === loginRole
    );

    if (!foundUser) {
      setLoginError(
        `No encontramos una cuenta de tipo ${
          loginRole === "admin" ? "Administrador" : "Estudiante"
        } registrada con el correo "${loginEmail}".`
      );
      return;
    }

    // Check password if set, or accept default
    if (foundUser.password && loginPassword && foundUser.password !== loginPassword) {
      setLoginError("La contraseña ingresada es incorrecta.");
      return;
    }

    onLogin(foundUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      return;
    }

    // Check if email already exists
    const exists = users.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (exists) {
      alert("Este correo electrónico ya se encuentra registrado. Por favor inicia sesión.");
      setAuthMode("login");
      setLoginEmail(regEmail);
      return;
    }

    const created = onRegisterStudent({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: "student",
      status: "pendiente", // Controlled access: admin approval needed
      targetUniversity: regUniversity,
      targetCareer: regCareer,
    });

    setRegisterSuccessMsg(
      `🎉 ¡Cuenta creada con éxito para ${created.name}! Tu usuario está en revisión (Estado: PENDIENTE) y será activado por el Administrador.`
    );

    setTimeout(() => {
      onLogin(created);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-2xl w-full overflow-hidden my-auto relative animate-fade-in">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 text-center relative overflow-hidden">
          {/* Volver a la landing button top header */}
          {onCancel && (
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-white/20 shadow-sm backdrop-blur-xs min-h-[36px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la Landing</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer border border-white/20 shadow-sm flex items-center justify-center min-w-[32px] min-h-[32px]"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D96FF]/10 rounded-full blur-2xl"></div>
          <h2 className="text-xl sm:text-2xl font-black mt-8 sm:mt-4 mb-1 text-center">
            Acceso controlado para Administradores, Estudiantes y Apoderados
          </h2>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center space-x-2 mt-6 bg-slate-800/80 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-700">
            <button
              onClick={() => {
                setAuthMode("login");
                setLoginError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                authMode === "login"
                  ? "bg-[#4D96FF] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => {
                setAuthMode("register");
                setRegisterSuccessMsg(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                authMode === "register"
                  ? "bg-[#6BCB77] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registro Alumno</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* MODE 1: LOGIN FORM */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Role Toggle */}
              <div>
                <label className="font-bold text-slate-700 block mb-2">Selecciona tu Rol:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole("student")}
                    className={`py-2 px-2.5 rounded-2xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      loginRole === "student"
                        ? "bg-blue-50 text-[#4D96FF] border-[#4D96FF] ring-2 ring-blue-400/20 font-black"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Estudiante</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginRole("parent")}
                    className={`py-2 px-2.5 rounded-2xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      loginRole === "parent"
                        ? "bg-purple-50 text-purple-700 border-purple-400 ring-2 ring-purple-400/20 font-black"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Apoderado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginRole("admin")}
                    className={`py-2 px-2.5 rounded-2xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      loginRole === "admin"
                        ? "bg-amber-50 text-amber-800 border-amber-400 ring-2 ring-amber-400/20 font-black"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={
                      loginRole === "admin"
                        ? "admin@prepup.pe"
                        : "santiago@estudiante.pe"
                    }
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4D96FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contraseña:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Contraseña (opcional en demo)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4D96FF] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm"
              >
                <span>Ingresar a la Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: STUDENT REGISTRATION FORM */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  <strong>Registro de Alumno con Acceso Controlado:</strong> Tu solicitud será enviada al dashboard del Administrador para su aprobación y activación.
                </p>
              </div>

              {registerSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2 font-bold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{registerSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Postulante:</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Luciana Valenzuela"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="luciana.v@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Crea tu Contraseña:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>Universidad Objetivo:</span>
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Perú 🇵🇪
                    </span>
                  </label>
                  <select
                    value={regUniversity}
                    onChange={(e) => {
                      const newUniName = e.target.value;
                      setRegUniversity(newUniName);
                      const found = universities.find(
                        (u) => u.name === newUniName || u.shortName === newUniName || newUniName.includes(u.shortName)
                      );
                      if (found && found.careers && found.careers.length > 0) {
                        setRegCareer(found.careers[0]);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BCB77] text-xs font-bold text-slate-800"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.logoEmoji || "🏛️"} {u.name} ({u.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  {(() => {
                    const selectedUniObj = universities.find(
                      (u) => u.name === regUniversity || u.shortName === regUniversity || regUniversity.includes(u.shortName)
                    ) || universities[0];
                    const availableCareers = selectedUniObj?.careers || ["Medicina Humana", "Ingeniería de Sistemas", "Derecho", "Administración"];
                    const isOptionInList = availableCareers.includes(regCareer);

                    return (
                      <>
                        <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                          <span>Carrera Deseada:</span>
                          <span className="text-[10px] text-blue-700 font-extrabold bg-blue-100 px-2 py-0.5 rounded-full">
                            Segun {selectedUniObj?.shortName || "Universidad"}
                          </span>
                        </label>
                        <select
                          value={isOptionInList ? regCareer : "OTRA"}
                          onChange={(e) => {
                            if (e.target.value === "OTRA") {
                              setRegCareer("");
                            } else {
                              setRegCareer(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BCB77] text-xs font-bold text-slate-800"
                        >
                          {availableCareers.map((c) => (
                            <option key={c} value={c}>
                              🎓 {c}
                            </option>
                          ))}
                          <option value="OTRA">✏️ Otra carrera (Escribir libremente)...</option>
                        </select>

                        {(!isOptionInList || regCareer === "") && (
                          <input
                            type="text"
                            required
                            placeholder="Escribe el nombre de tu carrera..."
                            value={regCareer}
                            onChange={(e) => setRegCareer(e.target.value)}
                            className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#6BCB77] text-xs font-medium"
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarme como Alumno</span>
              </button>
            </form>
          )}

          {onCancel && (
            <div className="text-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer inline-flex items-center space-x-2 min-h-[40px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Landing Page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
