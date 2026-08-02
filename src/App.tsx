/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ReactNode, ErrorInfo } from "react";
import { UserPlan, DailyTask, SimulacroResult, PlatformUser, UserStatus, UserRole, BankQuestion, UniversityItem } from "./types";
import { Header, NavTab } from "./components/Header";
import { DashboardOverview } from "./components/DashboardOverview";
import { DailyPlanner } from "./components/DailyPlanner";
import { SimulacroEngine } from "./components/SimulacroEngine";
import { AITutorModal } from "./components/AITutorModal";
import { KeyQuestionsModal } from "./components/KeyQuestionsModal";
import { PlanSetupWizard } from "./components/PlanSetupWizard";
import { OnboardingModal } from "./components/OnboardingModal";
import { AgrariaGamifiedEngine } from "./components/AgrariaGamifiedEngine";
import { UserManagementView } from "./components/UserManagementView";
import { QuestionRepositoryAdminView } from "./components/QuestionRepositoryAdminView";
import { PendingApprovalBanner } from "./components/PendingApprovalBanner";
import { AuthView } from "./components/AuthView";
import { LandingPage } from "./components/LandingPage";
import { ParentPortalView } from "./components/ParentPortalView";
import { ParentNotification } from "./types";
import { INITIAL_PLATFORM_USERS, INITIAL_BANK_QUESTIONS, INITIAL_UNIVERSITIES } from "./data/initialRepositoryData";
import { CareerPlanRegistry } from "./data/careerStudyPlans";

const INITIAL_PLAN: UserPlan = {
  id: "plan_default",
  studentName: "Santiago",
  targetCountry: "Perú",
  targetUniversity: "UNMSM (San Marcos)",
  targetExamName: "Examen de Admisión DECO® UNMSM",
  targetCareer: "Medicina Humana / Ciencias de la Salud",
  durationMonths: 6,
  startDate: new Date().toISOString(),
  examDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  dailyStudyHoursGoal: 3,
  weakSubjects: ["Física", "Química"],
  currentStreakDays: 12,
  totalStudyMinutes: 2400,
};

const INITIAL_TASKS: DailyTask[] = CareerPlanRegistry.getBaseTasksForCareer(
  INITIAL_PLAN.targetCareer
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Lightweight Error Boundary to catch any render errors and prevent white screens
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };
  public declare props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught render error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem("preu_user_plan");
    localStorage.removeItem("preu_daily_tasks");
    localStorage.removeItem("preu_simulacro_results");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md shadow-lg border-2 border-red-200 space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-[#2D3436]">Algo ocurrió al cargar esta vista</h2>
            <p className="text-xs text-slate-500 font-medium">
              Hemos detectado un problema con los datos almacenados. Puedes restablecer la configuración predeterminada para continuar probando la aplicación.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#4D96FF] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
            >
              Restablecer y Cargar App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [plan, setPlan] = useState<UserPlan>(() => {
    try {
      const saved = localStorage.getItem("preu_user_plan");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return { ...INITIAL_PLAN, ...parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLAN;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem("preu_daily_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  const [simulacroResults, setSimulacroResults] = useState<SimulacroResult[]>(() => {
    try {
      const saved = localStorage.getItem("preu_simulacro_results");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // --- PLATFORM USERS MODULE STATE ---
  const [users, setUsers] = useState<PlatformUser[]>(() => {
    try {
      const saved = localStorage.getItem("preu_platform_users");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLATFORM_USERS;
  });

  // Current logged in user (null by default if unauthenticated, or Santiago student demo)
  const [currentUser, setCurrentUser] = useState<PlatformUser | null>(() => {
    try {
      const saved = localStorage.getItem("preu_current_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // --- QUESTION BANK REPOSITORY STATE ---
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>(() => {
    try {
      const saved = localStorage.getItem("preu_bank_questions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BANK_QUESTIONS;
  });

  const [universities, setUniversities] = useState<UniversityItem[]>(() => {
    try {
      const saved = localStorage.getItem("preu_universities");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_UNIVERSITIES;
  });

  useEffect(() => {
    localStorage.setItem("preu_universities", JSON.stringify(universities));
  }, [universities]);

  // Default active view to Landing page for public visitors
  const [activeTab, setActiveTab] = useState<NavTab>("landing");

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Tracks every user id that has ever logged in, so we can tell first-time logins apart from returning ones
  const [seenUserIds, setSeenUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("preu_seen_user_ids");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("preu_seen_user_ids", JSON.stringify(seenUserIds));
  }, [seenUserIds]);

  // Whether the CURRENT session's login is that user's first ever (kept true for the whole session, even across refreshes)
  const [isFirstLoginSession, setIsFirstLoginSession] = useState<boolean>(() => {
    try {
      return localStorage.getItem("preu_first_login_session") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("preu_first_login_session", String(isFirstLoginSession));
  }, [isFirstLoginSession]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("preu_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("preu_current_user");
    }
  }, [currentUser]);

  const handleSendParentNotification = (studentId: string, notif: ParentNotification) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId) {
          const updatedHistory = [notif, ...(u.parentNotificationsHistory || [])];
          return { ...u, parentNotificationsHistory: updatedHistory };
        }
        return u;
      })
    );
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem("preu_onboarding_seen", "true");
    setShowOnboarding(false);
    setActiveTab("dashboard");
  };

  useEffect(() => {
    localStorage.setItem("preu_user_plan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("preu_daily_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("preu_simulacro_results", JSON.stringify(simulacroResults));
  }, [simulacroResults]);

  useEffect(() => {
    localStorage.setItem("preu_platform_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("preu_bank_questions", JSON.stringify(bankQuestions));
  }, [bankQuestions]);

  // --- USER MANAGEMENT HANDLERS ---
  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    // If the updated user is currently active profile, update currentUser too
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const handleAddUser = (
    newUser: Omit<
      PlatformUser,
      "id" | "registeredAt" | "simulacrosCompletedCount" | "averageScorePercentage" | "lastActive"
    >
  ) => {
    const created: PlatformUser = {
      ...newUser,
      id: "u_" + Date.now(),
      registeredAt: new Date().toISOString(),
      simulacrosCompletedCount: 0,
      averageScorePercentage: 0,
      lastActive: "Hace un momento",
    };
    setUsers((prev) => [created, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // --- QUESTION BANK HANDLERS ---
  const handleAddQuestion = (newQ: Omit<BankQuestion, "id" | "createdAt">) => {
    const created: BankQuestion = {
      ...newQ,
      id: "q_" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBankQuestions((prev) => [created, ...prev]);
  };

  const handleUpdateQuestion = (updatedQ: BankQuestion) => {
    setBankQuestions((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setBankQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleBulkAddQuestions = (
    newQuestions: Omit<BankQuestion, "id" | "createdAt">[]
  ) => {
    const createdList: BankQuestion[] = newQuestions.map((q, idx) => ({
      ...q,
      id: "q_bulk_" + Date.now() + "_" + idx,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    setBankQuestions((prev) => [...createdList, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<DailyTask, "id">) => {
    const created: DailyTask = {
      ...newTask,
      id: "task_" + Date.now(),
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleLogStudyMinutes = (mins: number) => {
    setPlan((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + mins,
    }));
  };

  const handleSaveSimulacroResult = (res: SimulacroResult) => {
    setSimulacroResults((prev) => [res, ...prev]);
  };

  const handleStartStudyTask = (_task: DailyTask) => {
    setActiveTab("planner");
  };

  const handleReloadCareerBaseTasks = () => {
    const baseTasks = CareerPlanRegistry.getBaseTasksForCareer(plan.targetCareer);
    setTasks(baseTasks);
  };

  const handleSavePlan = (updatedPlan: UserPlan) => {
    const prevCareer = plan.targetCareer;
    setPlan(updatedPlan);
    if (updatedPlan.targetCareer !== prevCareer) {
      const baseTasks = CareerPlanRegistry.getBaseTasksForCareer(updatedPlan.targetCareer);
      setTasks(baseTasks);
    }
  };

  const pendingUsersCount = users.filter((u) => u.status === "pendiente").length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F0F4F8] text-[#2D3436] font-sans selection:bg-[#4D96FF] selection:text-white">
        {/* Header with Navigation - Displayed ONLY when user is logged in */}
        {currentUser && activeTab !== "landing" && activeTab !== "auth" && (
          <Header
            plan={plan}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSettings={isFirstLoginSession ? () => setShowSettingsModal(true) : undefined}
            onOpenOnboarding={() => setShowOnboarding(true)}
            currentUser={currentUser}
            pendingUsersCount={pendingUsersCount}
            onLogout={() => {
              setCurrentUser(null);
              setIsFirstLoginSession(false);
              setActiveTab("landing");
            }}
          />
        )}

        {/* Main Content Area */}
        {activeTab === "landing" || activeTab === "auth" ? (
          <div className="w-full relative">
            <LandingPage
              universities={universities}
              students={users.filter((u) => u.role === "student")}
              onOpenLogin={() => {
                setActiveTab("auth");
              }}
              onOpenRegister={() => {
                setActiveTab("auth");
              }}
              onSendParentNotification={handleSendParentNotification}
            />

            {/* Auth Modal over Landing Page */}
            {activeTab === "auth" && (
              <AuthView
                users={users}
                universities={universities}
                onLogin={(user) => {
                  const firstTime = !seenUserIds.includes(user.id);
                  setIsFirstLoginSession(firstTime);
                  if (firstTime) {
                    setSeenUserIds((prev) => [...prev, user.id]);
                  }
                  setCurrentUser(user);
                  // Redirect depending on role
                  if (user.role === "admin") {
                    setActiveTab("users_admin");
                  } else if (user.role === "parent") {
                    setActiveTab("parent_portal");
                  } else {
                    setActiveTab("dashboard");
                  }
                }}
                onRegisterStudent={(newStudentData) => {
                  const created: PlatformUser = {
                    ...newStudentData,
                    id: "u_" + Date.now(),
                    registeredAt: new Date().toISOString(),
                    simulacrosCompletedCount: 0,
                    averageScorePercentage: 0,
                    lastActive: "Hace un momento",
                  };
                  setUsers((prev) => [created, ...prev]);
                  return created;
                }}
                onCancel={() => setActiveTab("landing")}
              />
            )}
          </div>
        ) : (
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 h-auto">
            {/* Banner for Students Pending Approval */}
            {currentUser?.role === "student" && currentUser.status === "pendiente" && (
              <PendingApprovalBanner
                studentName={currentUser.name}
                targetUniversity={currentUser.targetUniversity}
                onSimulateApproval={() => {
                  handleUpdateUserStatus(currentUser.id, "activo");
                }}
              />
            )}

            {activeTab === "parent_portal" && (
              <ParentPortalView
                currentUser={currentUser || users.find((u) => u.role === "parent") || users[0]}
                allUsers={users}
                onSendNotification={handleSendParentNotification}
              />
            )}

          {activeTab === "questions" && (
            <KeyQuestionsModal
              onApplyAnswers={(answers) => {
                if (answers.examType) {
                  setPlan((prev) => ({
                    ...prev,
                    targetUniversity: answers.examType,
                  }));
                }
              }}
            />
          )}

          {activeTab === "users_admin" && (
            <UserManagementView
              users={users}
              universities={universities}
              onUpdateUniversities={setUniversities}
              onUpdateUserStatus={handleUpdateUserStatus}
              onUpdateUserRole={handleUpdateUserRole}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              currentUser={currentUser}
              onSwitchProfile={(u) => setCurrentUser(u)}
              onGoToRepositoryAdmin={() => setActiveTab("repo_admin")}
            />
          )}

          {activeTab === "repo_admin" && (
            <QuestionRepositoryAdminView
              universities={universities}
              questions={bankQuestions}
              onAddQuestion={handleAddQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onBulkAddQuestions={handleBulkAddQuestions}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardOverview
              plan={plan}
              tasks={tasks}
              onStartStudyTask={handleStartStudyTask}
              onGoToSimulacro={() => setActiveTab("simulacro")}
              onOpenAITutor={() => setActiveTab("ai_tutor")}
              onGoToAgraria={() => setActiveTab("agraria")}
            />
          )}

          {activeTab === "planner" && (
            <DailyPlanner
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              plan={plan}
              onLogStudyMinutes={handleLogStudyMinutes}
              onReloadCareerBaseTasks={handleReloadCareerBaseTasks}
            />
          )}

          {activeTab === "simulacro" && (
            <SimulacroEngine
              plan={plan}
              onSaveResult={handleSaveSimulacroResult}
            />
          )}

          {activeTab === "agraria" && (
            <AgrariaGamifiedEngine />
          )}

          {activeTab === "ai_tutor" && (
            <AITutorModal
              targetExam={plan.targetUniversity}
            />
          )}
        </main>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <PlanSetupWizard
              currentPlan={plan}
              onSavePlan={handleSavePlan}
              onClose={() => setShowSettingsModal(false)}
            />
          </div>
        )}

        {/* Onboarding Product Tour Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onStartExploring={handleFinishOnboarding}
        />
      </div>
    </ErrorBoundary>
  );
}
