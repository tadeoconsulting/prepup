import React, { useState } from "react";
import { PlatformUser, UserStatus, UserRole, UniversityItem } from "../types";
import { INITIAL_UNIVERSITIES } from "../data/initialRepositoryData";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Shield,
  GraduationCap,
  Sparkles,
  Search,
  Check,
  UserPlus,
  RotateCcw,
  BarChart2,
  Mail,
  Building,
  Target,
  Trash2,
  BookOpen,
  Edit3,
  KeyRound,
  Copy,
  RefreshCw
} from "lucide-react";

interface UserManagementViewProps {
  users: PlatformUser[];
  universities?: UniversityItem[];
  onUpdateUniversities?: (updated: UniversityItem[]) => void;
  onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onUpdateUserPassword: (userId: string, newPassword: string) => void;
  onAddUser: (user: Omit<PlatformUser, "id" | "registeredAt" | "simulacrosCompletedCount" | "averageScorePercentage" | "lastActive">) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: PlatformUser;
  onGoToRepositoryAdmin?: () => void;
}

const generateStrongPassword = (): string => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const rest = Array.from({ length: 8 }, () => pick(all));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
};

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  universities = INITIAL_UNIVERSITIES,
  onUpdateUniversities,
  onUpdateUserStatus,
  onUpdateUserRole,
  onUpdateUserPassword,
  onAddUser,
  onDeleteUser,
  currentUser,
  onGoToRepositoryAdmin,
}) => {
  const [filterTab, setFilterTab] = useState<"todos" | "pendiente" | "activo" | "inactivo">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState<PlatformUser | null>(null);
  const [passwordMode, setPasswordMode] = useState<"generate" | "manual">("generate");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [manualPasswordConfirm, setManualPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Editable Universities & Careers Management State
  const [activeSubTab, setActiveSubTab] = useState<"users" | "universities">("users");
  const [newCareerInput, setNewCareerInput] = useState<Record<string, string>>({});
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [uniFormName, setUniFormName] = useState("");
  const [uniFormShortName, setUniFormShortName] = useState("");
  const [uniFormEmoji, setUniFormEmoji] = useState("🏛️");
  const [uniFormDesc, setUniFormDesc] = useState("");
  const [uniFormCareers, setUniFormCareers] = useState("");

  // Form State for Manual User Creation
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("student");
  const [newStatus, setNewStatus] = useState<UserStatus>("activo");
  const [newUniversity, setNewUniversity] = useState(universities[0]?.name || "UNMSM (San Marcos)");
  const [newCareer, setNewCareer] = useState(universities[0]?.careers?.[0] || "Medicina Humana");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openPasswordModal = (targetUser: PlatformUser) => {
    setPasswordTargetUser(targetUser);
    setPasswordMode("generate");
    setGeneratedPassword(generateStrongPassword());
    setManualPassword("");
    setManualPasswordConfirm("");
    setPasswordError(null);
    setShowPasswordModal(true);
  };

  const handleSaveGeneratedPassword = () => {
    if (!passwordTargetUser) return;
    onUpdateUserPassword(passwordTargetUser.id, generatedPassword);
    setShowPasswordModal(false);
    showToast(`🔑 Contraseña regenerada para ${passwordTargetUser.name}.`);
  };

  const handleSaveManualPassword = () => {
    if (!passwordTargetUser) return;
    setPasswordError(null);
    if (manualPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (manualPassword !== manualPasswordConfirm) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    onUpdateUserPassword(passwordTargetUser.id, manualPassword);
    setShowPasswordModal(false);
    showToast(`🔑 Contraseña actualizada para ${passwordTargetUser.name}.`);
  };

  // Helper to update global universities
  const updateGlobalUniversities = (newList: UniversityItem[]) => {
    if (onUpdateUniversities) {
      onUpdateUniversities(newList);
    }
  };

  // Add career to a specific university
  const handleAddCareerToUni = (uniId: string) => {
    const careerText = (newCareerInput[uniId] || "").trim();
    if (!careerText) return;

    const updated = universities.map((u) => {
      if (u.id === uniId) {
        const existing = u.careers || [];
        if (existing.includes(careerText)) return u;
        return { ...u, careers: [...existing, careerText] };
      }
      return u;
    });

    updateGlobalUniversities(updated);
    setNewCareerInput((prev) => ({ ...prev, [uniId]: "" }));
    showToast(`✅ Carrera "${careerText}" agregada al catálogo.`);
  };

  // Delete career from a specific university
  const handleRemoveCareerFromUni = (uniId: string, careerIndex: number) => {
    const updated = universities.map((u) => {
      if (u.id === uniId) {
        const newCareers = [...(u.careers || [])];
        newCareers.splice(careerIndex, 1);
        return { ...u, careers: newCareers };
      }
      return u;
    });

    updateGlobalUniversities(updated);
    showToast(`🗑️ Carrera removida del catálogo.`);
  };

  // Create new university
  const handleCreateNewUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniFormName.trim() || !uniFormShortName.trim()) return;

    const parsedCareers = uniFormCareers
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newUniItem: UniversityItem = {
      id: "uni_" + Date.now(),
      name: uniFormName.trim(),
      shortName: uniFormShortName.trim().toUpperCase(),
      country: "Perú 🇵🇪",
      logoEmoji: uniFormEmoji || "🏛️",
      description: uniFormDesc || "Universidad con examen de admisión.",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      careers: parsedCareers.length > 0 ? parsedCareers : ["Medicina Humana", "Ingeniería de Sistemas", "Derecho"],
    };

    updateGlobalUniversities([newUniItem, ...universities]);
    showToast(`🏛️ Universidad "${uniFormShortName}" creada exitosamente.`);
    setShowAddUniModal(false);
    setUniFormName("");
    setUniFormShortName("");
    setUniFormDesc("");
    setUniFormCareers("");
  };

  // Reset Universities to default
  const handleResetUniversitiesCatalog = () => {
    if (confirm("¿Deseas restablecer el catálogo de Universidades y Carreras Peruanas al estado inicial?")) {
      updateGlobalUniversities(INITIAL_UNIVERSITIES);
      showToast("🔄 Catálogo de Universidades restablecido a la configuración por defecto.");
    }
  };

  // Metrics calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "activo").length;
  const pendingUsers = users.filter((u) => u.status === "pendiente").length;
  const inactiveUsers = users.filter((u) => u.status === "inactivo").length;
  const students = users.filter((u) => u.role === "student");
  const avgScore =
    students.length > 0
      ? Math.round(
          students.reduce((acc, curr) => acc + (curr.averageScorePercentage || 0), 0) /
            students.length
        )
      : 0;

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesTab = filterTab === "todos" ? true : u.status === filterTab;
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.targetUniversity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    onAddUser({
      name: newName,
      email: newEmail,
      role: newRole,
      status: newStatus,
      targetUniversity: newUniversity,
      targetCareer: newCareer,
    });

    showToast(`✅ Usuario "${newName}" creado exitosamente.`);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2D3436] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role Switcher Sandbox Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4D96FF]/20 border border-[#4D96FF]/40 flex items-center justify-center text-[#4D96FF] text-xl font-black">
              {currentUser.role === "admin" ? "👑" : "🎓"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Perfil Actual en Vista
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase ${
                    currentUser.role === "admin"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                  }`}
                >
                  {currentUser.role === "admin" ? "Administrador Master" : "Estudiante"}
                </span>
              </div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {currentUser.name}
                <span className="text-xs font-medium text-slate-400">({currentUser.email})</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation: Users vs University & Career Catalog */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/80 p-1.5 rounded-2xl">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setActiveSubTab("users")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "users"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            <span>Usuarios ({totalUsers})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("universities")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "universities"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            <span>Universidades ({universities.length})</span>
          </button>
        </div>

        {activeSubTab === "universities" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddUniModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 hidden sm:block" />
              <span>Registrar Nueva Universidad</span>
            </button>
            <button
              onClick={handleResetUniversitiesCatalog}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
              title="Restablecer universidades por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5 hidden sm:block" />
              <span>Restablecer</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: USER MANAGEMENT */}
      {activeSubTab === "users" && (
        <>
          {/* Header Info & Action Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-[#4D96FF]" />
                <h1 className="text-2xl font-black text-[#2D3436]">Módulo de Gestión de Usuarios</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Control de acceso registrado, activación de estudiantes y métricas globales de avance.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {onGoToRepositoryAdmin && (
                <button
                  onClick={onGoToRepositoryAdmin}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-md flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer"
                >
                  <Building className="w-4 h-4 hidden sm:block" />
                  <span>Gestionar Banco de Preguntas</span>
                </button>
              )}

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#4D96FF] hover:bg-blue-600 text-white text-xs font-black rounded-2xl shadow-md flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 hidden sm:block" />
                <span>Crear Usuario Nuevo</span>
              </button>
            </div>
          </div>

      {/* Key KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrados</span>
            <div className="text-2xl font-black text-[#2D3436] mt-1">{totalUsers}</div>
            <span className="text-[11px] text-slate-500 font-medium">Usuarios en sistema</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#4D96FF] rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alumnos Activos</span>
            <div className="text-2xl font-black text-[#6BCB77] mt-1">{activeUsers}</div>
            <span className="text-[11px] text-emerald-600 font-bold">Con acceso permitido</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-[#6BCB77] rounded-2xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-xs flex items-center justify-between transition-all ${
            pendingUsers > 0
              ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/30"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pendientes Aprobación</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingUsers}</div>
            <span className="text-[11px] text-amber-700 font-semibold">
              {pendingUsers > 0 ? "⚠️ Requieren tu revisión" : "Al día"}
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Promedio Avance</span>
            <div className="text-2xl font-black text-[#4D96FF] mt-1">{avgScore}%</div>
            <span className="text-[11px] text-slate-500 font-medium">Efectividad simulacros</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Priority Section: Pending Approvals Queue */}
      {pendingUsers > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900">
              <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              <h2 className="text-base font-black">
                Solicitudes de Acceso Pendientes ({pendingUsers})
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-200/80 px-3 py-1 rounded-full">
              Acceso Controlado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users
              .filter((u) => u.status === "pendiente")
              .map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{student.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {student.email}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                      Pendiente
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Universidad Objetivo:</span>
                      <span className="font-bold text-slate-800">{student.targetUniversity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Carrera:</span>
                      <span className="font-bold text-[#4D96FF]">{student.targetCareer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onUpdateUserStatus(student.id, "activo");
                        showToast(`Aprobado y activado el acceso para ${student.name}`);
                      }}
                      className="flex-1 py-2 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprobar y Activar</span>
                    </button>

                    <button
                      onClick={() => {
                        onUpdateUserStatus(student.id, "inactivo");
                        showToast(`Rechazado/Desactivado ${student.name}`);
                      }}
                      className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      title="Rechazar solicitud"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Full Users Directory & Control Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterTab("todos")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === "todos" ? "bg-white text-slate-800 shadow-xs font-black" : "text-slate-500"
              }`}
            >
              Todos ({totalUsers})
            </button>
            <button
              onClick={() => setFilterTab("pendiente")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === "pendiente" ? "bg-amber-400 text-slate-900 shadow-xs font-black" : "text-slate-500"
              }`}
            >
              Pendientes ({pendingUsers})
            </button>
            <button
              onClick={() => setFilterTab("activo")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === "activo" ? "bg-[#6BCB77] text-white shadow-xs font-black" : "text-slate-500"
              }`}
            >
              Activos ({activeUsers})
            </button>
            <button
              onClick={() => setFilterTab("inactivo")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === "inactivo" ? "bg-slate-300 text-slate-800 shadow-xs font-black" : "text-slate-500"
              }`}
            >
              Inactivos ({inactiveUsers})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o universidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#4D96FF]"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-3">Usuario / Email</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Estado Acceso</th>
                <th className="py-3 px-3">Universidad & Carrera</th>
                <th className="py-3 px-3 text-center">Simulacros / Promedio</th>
                <th className="py-3 px-3 text-right">Acciones Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                    No se encontraron usuarios con el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{user.name}</span>
                          <span className="text-[11px] text-slate-400 block">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-blue-50 text-[#4D96FF] border border-blue-200"
                        }`}
                      >
                        {user.role === "admin" ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        {user.role === "admin" ? "Admin" : "Estudiante"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                          user.status === "activo"
                            ? "bg-emerald-100 text-emerald-800"
                            : user.status === "pendiente"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {user.status === "activo" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {user.status === "pendiente" && <Clock className="w-3 h-3 text-amber-600" />}
                        {user.status === "inactivo" && <XCircle className="w-3 h-3 text-slate-500" />}
                        <span className="capitalize">{user.status}</span>
                      </span>
                    </td>

                    {/* University & Career */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-slate-800 block">{user.targetUniversity}</span>
                        <span className="text-[11px] text-slate-500 block">{user.targetCareer}</span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-3 text-center">
                      <div>
                        <span className="font-black text-slate-800 block">
                          {user.simulacrosCompletedCount} hechos
                        </span>
                        <span className="text-[11px] font-bold text-[#4D96FF] block">
                          {user.averageScorePercentage}% prom.
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {user.status !== "activo" && (
                          <button
                            onClick={() => {
                              onUpdateUserStatus(user.id, "activo");
                              showToast(`Acceso ACTIVADO para ${user.name}`);
                            }}
                            className="px-2.5 py-1 bg-[#6BCB77] hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                            title="Aprobar y Activar Acceso"
                          >
                            Activar
                          </button>
                        )}

                        {user.status === "activo" && (
                          <button
                            onClick={() => {
                              onUpdateUserStatus(user.id, "inactivo");
                              showToast(`Acceso DESACTIVADO para ${user.name}`);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                            title="Desactivar acceso"
                          >
                            Desactivar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const newRole: UserRole = user.role === "admin" ? "student" : "admin";
                            onUpdateUserRole(user.id, newRole);
                            showToast(`Rol de ${user.name} cambiado a ${newRole.toUpperCase()}`);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                          title="Cambiar Rol"
                        >
                          {user.role === "admin" ? "Hacer Alumno" : "Hacer Admin"}
                        </button>

                        <button
                          onClick={() => openPasswordModal(user)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                          title={`Cambiar contraseña de ${user.name}`}
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* VIEW 2: UNIVERSITIES & CAREERS CATALOG MANAGEMENT */}
      {activeSubTab === "universities" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/60">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-2xl font-black">
                  🏛️
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Catálogo de Universidades y Carreras Peruanas
                    <span className="text-xs font-extrabold bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      Editable por Admin
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Administra el listado oficial de universidades peruanas y sus carreras afiliadas. Cualquier modificación se sincronizará automáticamente en las opciones de preferencia de registro y perfil de los alumnos.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddUniModal(true)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Universidad</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Universities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universities.map((uni) => {
              const careersList = uni.careers || ["Medicina Humana", "Ingeniería de Sistemas", "Derecho"];
              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Uni Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200 shrink-0">
                        {uni.logoEmoji || "🏛️"}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 text-base">{uni.name}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${uni.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                            {uni.shortName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium block mt-0.5">{uni.description}</span>
                      </div>
                    </div>
                  </div>

                  {/* Careers Section */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 flex items-center space-x-1">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Carreras Afiliadas ({careersList.length}):</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">PickList Condicional</span>
                    </div>

                    {/* Careers Chips */}
                    <div className="flex flex-wrap gap-1.5 min-h-[48px] p-2 bg-slate-50 rounded-2xl border border-slate-200/60">
                      {careersList.map((c, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-bold rounded-xl shadow-2xs group hover:border-red-300 transition-colors"
                        >
                          <span>{c}</span>
                          <button
                            onClick={() => handleRemoveCareerFromUni(uni.id, idx)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                            title={`Remover ${c}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Career Form */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Escribir nueva carrera..."
                        value={newCareerInput[uni.id] || ""}
                        onChange={(e) =>
                          setNewCareerInput((prev) => ({ ...prev, [uni.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCareerToUni(uni.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddCareerToUni(uni.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition-all cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add New Peruvian University */}
      {showAddUniModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-[#2D3436]">
                <Building className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-lg">Registrar Nueva Universidad Peruana</h3>
              </div>
              <button
                onClick={() => setShowAddUniModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewUniversity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Oficial de la Universidad:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Universidad Nacional de San Agustín"
                  value={uniFormName}
                  onChange={(e) => setUniFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Abreviatura / Siglas:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: UNSA"
                    value={uniFormShortName}
                    onChange={(e) => setUniFormShortName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emoji / Logo Icono:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 🏛️, 🌋, 🎓"
                    value={uniFormEmoji}
                    onChange={(e) => setUniFormEmoji(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción Breve o Enfoque:</label>
                <input
                  type="text"
                  placeholder="Ej: Examen de Admisión ordinario con secciones Medicina e Ingenierías."
                  value={uniFormDesc}
                  onChange={(e) => setUniFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Carreras Iniciales (separadas por comas):
                </label>
                <textarea
                  rows={3}
                  placeholder="Medicina Humana, Ingeniería Civil, Derecho, Odontología"
                  value={uniFormCareers}
                  onChange={(e) => setUniFormCareers(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUniModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer"
                >
                  Guardar Universidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User Manually */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-[#2D3436]">
                <UserPlus className="w-5 h-5 text-[#4D96FF]" />
                <h3 className="font-black text-lg">Registrar Usuario Controlado</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Rodríguez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rol:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  >
                    <option value="student">Estudiante</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado de Acceso Inicial:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  >
                    <option value="activo">Activo (Aprobado)</option>
                    <option value="pendiente">Pendiente de revisión</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Universidad Objetivo:</label>
                <select
                  value={newUniversity}
                  onChange={(e) => {
                    const uniName = e.target.value;
                    setNewUniversity(uniName);
                    const selected = universities.find((u) => u.name === uniName || u.shortName === uniName);
                    if (selected && selected.careers && selected.careers.length > 0) {
                      setNewCareer(selected.careers[0]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF] font-bold"
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
                  const selUniObj = universities.find((u) => u.name === newUniversity || u.shortName === newUniversity) || universities[0];
                  const availCareers = selUniObj?.careers || ["Medicina Humana", "Ingeniería de Sistemas", "Derecho"];
                  return (
                    <>
                      <label className="font-bold text-slate-700 block mb-1">
                        Carrera Objetivo (Segun {selUniObj?.shortName}):
                      </label>
                      <select
                        value={availCareers.includes(newCareer) ? newCareer : availCareers[0]}
                        onChange={(e) => setNewCareer(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF] font-bold"
                      >
                        {availCareers.map((c) => (
                          <option key={c} value={c}>
                            🎓 {c}
                          </option>
                        ))}
                      </select>
                    </>
                  );
                })()}
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl cursor-pointer"
                >
                  Guardar y Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal (Admin) */}
      {showPasswordModal && passwordTargetUser && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-slate-800">Cambiar Contraseña</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Usuario: <span className="font-bold text-slate-700">{passwordTargetUser.name}</span> ({passwordTargetUser.email})
            </p>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPasswordMode("generate")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  passwordMode === "generate" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                }`}
              >
                Generar Automáticamente
              </button>
              <button
                type="button"
                onClick={() => setPasswordMode("manual")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  passwordMode === "manual" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                }`}
              >
                Crear Manualmente
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {passwordError}
              </div>
            )}

            {passwordMode === "generate" ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 truncate">
                    {generatedPassword}
                  </code>
                  <button
                    type="button"
                    onClick={() => setGeneratedPassword(generateStrongPassword())}
                    title="Generar otra"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      showToast("📋 Contraseña copiada al portapapeles.");
                    }}
                    title="Copiar"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Copiá esta contraseña antes de guardar — no se volverá a mostrar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">Nueva Contraseña:</label>
                  <input
                    type="password"
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4D96FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">Confirmar Contraseña:</label>
                  <input
                    type="password"
                    minLength={8}
                    placeholder="Repite la contraseña"
                    value={manualPasswordConfirm}
                    onChange={(e) => setManualPasswordConfirm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4D96FF] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={passwordMode === "generate" ? handleSaveGeneratedPassword : handleSaveManualPassword}
                className="px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl cursor-pointer text-xs"
              >
                Guardar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
