import React, { useState } from "react";
import { PlatformUser, ParentNotification } from "../types";
import {
  Users,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  Bell,
  Sparkles,
  BarChart3,
  Calendar,
  ShieldCheck,
  Check
} from "lucide-react";

interface ParentPortalViewProps {
  currentUser: PlatformUser;
  allUsers: PlatformUser[];
  onSendNotification: (studentId: string, notif: ParentNotification) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  currentUser,
  allUsers,
  onSendNotification,
}) => {
  // Find linked student or fallback to active student Santiago
  const student =
    allUsers.find((u) => u.id === currentUser.linkedStudentId) ||
    allUsers.find((u) => u.role === "student" && u.status === "activo") ||
    allUsers.find((u) => u.role === "student") ||
    null;

  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <Users className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-black text-lg text-slate-800">No hay un estudiante vinculado</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Contacta con el Administrador para vincular tu correo de apoderado al usuario de tu hijo.
        </p>
      </div>
    );
  }

  const notifications = student.parentNotificationsHistory || [];

  const handleSendReportNow = () => {
    setIsSending(true);
    setTimeout(() => {
      const notif: ParentNotification = {
        id: "notif_" + Date.now(),
        sentAt: new Date().toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }),
        recipientEmail: currentUser.email,
        subject: `📊 Informe de Rendimiento Semanal: ${student.name}`,
        summaryText: `${student.name} registra un cumplimiento del 88% en su plan diario y un promedio de ${student.averageScorePercentage}% en sus simulacros para ${student.targetUniversity}.`,
        simulacrosAvg: student.averageScorePercentage,
        tasksCompletedPercentage: 88,
      };

      onSendNotification(student.id, notif);
      setIsSending(false);
      setSuccessMsg(`¡Reporte enviado exitosamente a tu correo (${currentUser.email})!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Portal Oficial de Padres y Apoderados</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Monitoreo Académico de {student.name}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl font-medium">
            Sigue el esfuerzo diario, constancia de simulacros y récords de asistencia de tu hijo con total transparencia.
          </p>
        </div>

        <button
          onClick={handleSendReportNow}
          disabled={isSending}
          className="z-10 px-5 py-3 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generando Reporte...</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>Enviar Reporte a Mi Correo</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 font-bold text-xs animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Student Profile Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Student info & target */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 text-[#4D96FF] rounded-2xl flex items-center justify-center font-black text-2xl shadow-xs">
              🎓
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Postulante
              </span>
              <h3 className="font-black text-base text-slate-900">{student.name}</h3>
              <p className="text-xs text-slate-500 font-bold">{student.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Universidad Objetivo:</span>
              <span className="font-black text-slate-800">{student.targetUniversity}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Carrera Deseada:</span>
              <span className="font-black text-slate-800">{student.targetCareer}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Estado en Plataforma:</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                {student.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Metrics */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Rendimiento en Exámenes
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#6BCB77]">
              {student.averageScorePercentage}%
            </span>
            <span className="text-xs font-bold text-slate-500">Promedio General</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Simulacros completados:</span>
              <span className="text-[#4D96FF] font-black">{student.simulacrosCompletedCount} ex.</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span>Constancia semanal:</span>
              <span className="text-emerald-600 font-black">88% de avance</span>
            </div>
          </div>
        </div>

        {/* Card 3: Parent Notification Preferences */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h4 className="font-black text-sm text-slate-900">Notificaciones para Apoderados</h4>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Recibes alertas automáticas cuando {student.name} completa simulacros importantes o alcanza metas de estudio.
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] font-bold space-y-1">
            <span className="block font-black">Correo Registrado del Padre:</span>
            <span className="block text-slate-700 font-mono">{currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Notification History Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-base text-slate-900">Historial de Reportes e Informes Enviados</h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">
            {notifications.length} informe(s) enviado(s)
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium space-y-2">
            <Mail className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Aún no se han enviado notificaciones para este estudiante.</p>
            <p className="text-[11px] text-slate-500">Haz clic arriba en "Enviar Reporte a Mi Correo" para generar el primero.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-black text-slate-900 text-sm">{notif.subject}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{notif.sentAt}</span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{notif.summaryText}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1 font-bold">
                  <span>Receptor: {notif.recipientEmail}</span>
                  <span>•</span>
                  <span className="text-emerald-600">Promedio: {notif.simulacrosAvg}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
