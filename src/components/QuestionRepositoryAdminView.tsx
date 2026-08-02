import React, { useState } from "react";
import { BankQuestion, UniversityItem } from "../types";
import {
  Database,
  Plus,
  Search,
  Filter,
  FileJson,
  Download,
  Upload,
  Edit2,
  Trash2,
  Building,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
  Layers,
  Copy,
  Check
} from "lucide-react";

interface QuestionRepositoryAdminViewProps {
  universities: UniversityItem[];
  questions: BankQuestion[];
  onAddQuestion: (question: Omit<BankQuestion, "id" | "createdAt">) => void;
  onUpdateQuestion: (question: BankQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onBulkAddQuestions: (newQuestions: Omit<BankQuestion, "id" | "createdAt">[]) => void;
  onAddUniversity?: (uni: UniversityItem) => void;
}

export const QuestionRepositoryAdminView: React.FC<QuestionRepositoryAdminViewProps> = ({
  universities,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onBulkAddQuestions,
}) => {
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Single Question Form State
  const [formUniId, setFormUniId] = useState("unmsm");
  const [formSubject, setFormSubject] = useState("Matemáticas");
  const [formTopic, setFormTopic] = useState("Ecuaciones Cuadráticas");
  const [formDifficulty, setFormDifficulty] = useState<BankQuestion["difficulty"]>("Intermedio");
  const [formQuestionText, setFormQuestionText] = useState("");
  const [formOptionA, setFormOptionA] = useState("");
  const [formOptionB, setFormOptionB] = useState("");
  const [formOptionC, setFormOptionC] = useState("");
  const [formOptionD, setFormOptionD] = useState("");
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState("");

  // Bulk JSON State
  const [bulkJsonText, setBulkJsonText] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // List of unique subjects
  const availableSubjects = Array.from(new Set(questions.map((q) => q.subject)));

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesUni = selectedUniversityId === "all" ? true : q.universityId === selectedUniversityId;
    const matchesSub = selectedSubject === "all" ? true : q.subject === selectedSubject;
    const matchesQuery =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.universityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUni && matchesSub && matchesQuery;
  });

  const handleSaveSingleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formOptionA.trim() || !formOptionB.trim()) {
      alert("Por favor completa el texto de la pregunta y al menos dos opciones.");
      return;
    }

    const matchedUni = universities.find((u) => u.id === formUniId);
    const uniName = matchedUni ? matchedUni.name : "Universidad General";

    const options = [formOptionA, formOptionB, formOptionC, formOptionD].filter((opt) => opt.trim() !== "");

    if (editingQuestion) {
      onUpdateQuestion({
        ...editingQuestion,
        universityId: formUniId,
        universityName: uniName,
        subject: formSubject,
        topic: formTopic,
        difficulty: formDifficulty,
        questionText: formQuestionText,
        options,
        correctOptionIndex: formCorrectIndex,
        explanation: formExplanation,
      });
      showToast("✅ Pregunta actualizada correctamente.");
    } else {
      onAddQuestion({
        universityId: formUniId,
        universityName: uniName,
        subject: formSubject,
        topic: formTopic,
        difficulty: formDifficulty,
        questionText: formQuestionText,
        options,
        correctOptionIndex: formCorrectIndex,
        explanation: formExplanation,
      });
      showToast("🎉 Nueva pregunta agregada al repositorio.");
    }

    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setFormQuestionText("");
    setFormOptionA("");
    setFormOptionB("");
    setFormOptionC("");
    setFormOptionD("");
    setFormExplanation("");
    setFormTopic("");
  };

  const handleOpenEdit = (q: BankQuestion) => {
    setEditingQuestion(q);
    setFormUniId(q.universityId);
    setFormSubject(q.subject);
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormQuestionText(q.questionText);
    setFormOptionA(q.options[0] || "");
    setFormOptionB(q.options[1] || "");
    setFormOptionC(q.options[2] || "");
    setFormOptionD(q.options[3] || "");
    setFormCorrectIndex(q.correctOptionIndex);
    setFormExplanation(q.explanation);
    setShowAddModal(true);
  };

  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        alert("El contenido JSON debe ser una lista de preguntas (un arreglo '[...]').");
        return;
      }

      const validItems: Omit<BankQuestion, "id" | "createdAt">[] = parsed.map((item) => ({
        universityId: item.universityId || "unmsm",
        universityName: item.universityName || "UNMSM",
        subject: item.subject || "General",
        topic: item.topic || "Tema General",
        difficulty: item.difficulty || "Intermedio",
        questionText: item.questionText || item.question || "Pregunta sin texto",
        options: Array.isArray(item.options) ? item.options : ["A", "B", "C", "D"],
        correctOptionIndex: typeof item.correctOptionIndex === "number" ? item.correctOptionIndex : 0,
        explanation: item.explanation || "Solución detallada.",
      }));

      onBulkAddQuestions(validItems);
      showToast(`⚡ ¡Importación masiva exitosa! Se añadieron ${validItems.length} preguntas.`);
      setShowBulkModal(false);
      setBulkJsonText("");
    } catch (e) {
      alert("Error al analizar el formato JSON. Revisa que la sintaxis sea correcta.");
    }
  };

  const jsonTemplateExample = JSON.stringify(
    [
      {
        universityId: "unmsm",
        universityName: "UNMSM (San Marcos)",
        subject: "Biología",
        topic: "Genética Mendeliana",
        difficulty: "Intermedio",
        questionText: "Al cruzar dos plantas heterocigotas para el color de flor (Aa x Aa), ¿cuál es la proporción fenotípica esperada?",
        options: ["3 de flores rojas : 1 blanca", "1 de flores rojas : 1 blanca", "100% flores rojas", "2 rojas : 2 blancas"],
        correctOptionIndex: 0,
        explanation: "Mendel demostró que la relación fenotípica de la F2 para un monohibridismo con dominancia completa es 3:1."
      }
    ],
    null,
    2
  );

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(jsonTemplateExample);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-2xl font-black">
              📚
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Alimentación e Ingesta de Datos
              </span>
              <h1 className="text-xl md:text-2xl font-black">
                Repositorio de Banco de Preguntas por Universidad
              </h1>
              <p className="text-xs text-blue-200 mt-1 max-w-xl">
                Agrega y actualiza preguntas fácilmente. Cuando los alumnos seleccionen su universidad, se les mostrarán los retos y simulacros correspondientes a esta información.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Total en Banco</span>
              <span className="text-xl font-black text-amber-300">{questions.length} Preguntas</span>
            </div>
            <Database className="w-6 h-6 text-amber-300" />
          </div>
        </div>
      </div>

      {/* University Directory Question Counters */}
      <div>
        <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#4D96FF]" />
          <span>Banco Disponible por Universidad</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedUniversityId("all")}
            className={`p-3 rounded-2xl border transition-all text-left cursor-pointer ${
              selectedUniversityId === "all"
                ? "bg-[#4D96FF] text-white border-blue-600 shadow-md font-black scale-102"
                : "bg-white text-slate-800 border-slate-200 hover:border-blue-300"
            }`}
          >
            <span className="text-xs font-bold block">🌐 Todas las Univ.</span>
            <span className="text-lg font-black block mt-1">{questions.length} ítems</span>
          </button>

          {universities.map((uni) => {
            const count = questions.filter((q) => q.universityId === uni.id).length;
            const isSelected = selectedUniversityId === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => setSelectedUniversityId(uni.id)}
                className={`p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#2D3436] text-white border-slate-900 shadow-md scale-102"
                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{uni.logoEmoji}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      isSelected ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count} preguntas
                  </span>
                </div>
                <span className="text-xs font-bold block mt-2 truncate">{uni.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search, Filters, Add & Bulk Actions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en preguntas o temas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4D96FF] focus:outline-none"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#4D96FF]"
            >
              <option value="all">Todas las Asignaturas</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Actions: Add Single & Bulk JSON */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl border border-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileJson className="w-4 h-4 text-purple-600" />
              <span>Carga Masiva JSON</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Pregunta</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3 pt-2">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">No hay preguntas para los filtros seleccionados.</p>
              <p className="text-xs text-slate-400 mt-1">
                Utiliza el botón "Nueva Pregunta" o "Carga Masiva JSON" para añadir más retos.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200 transition-all shadow-2xs hover:shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-blue-100 text-[#4D96FF] border border-blue-200">
                      {q.universityName}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-slate-200 text-slate-700">
                      {q.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• {q.topic}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer"
                      title="Editar pregunta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("¿Estás seguro de eliminar esta pregunta del repositorio?")) {
                          onDeleteQuestion(q.id);
                          showToast("Pregunta eliminada.");
                        }
                      }}
                      className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 cursor-pointer"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">{q.questionText}</p>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correctOptionIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-black mr-1.5">{String.fromCharCode(65 + idx)})</span>
                          {opt}
                        </span>
                        {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                    <span className="font-bold text-amber-800 block mb-0.5">💡 Explicación / Solucionario:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Single Question Creator/Editor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-800">
                {editingQuestion ? "Editar Pregunta" : "Nueva Pregunta para el Repositorio"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSingleQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Universidad Target:</label>
                  <select
                    value={formUniId}
                    onChange={(e) => setFormUniId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Asignatura:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Biología, Física, Raz. Verbal..."
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tema / Capítulo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Estequiometría, Citología..."
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dificultad:</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as BankQuestion["difficulty"])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nivel Cachimbo">Nivel Cachimbo 🔥</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Enunciado de la Pregunta:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe el texto completo del ejercicio o pregunta..."
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                />
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Alternativas de Respuesta (Marque la Correcta):</span>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={formCorrectIndex === 0}
                    onChange={() => setFormCorrectIndex(0)}
                    className="w-4 h-4 text-[#6BCB77]"
                  />
                  <span className="font-black text-slate-600">A)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opción A"
                    value={formOptionA}
                    onChange={(e) => setFormOptionA(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={formCorrectIndex === 1}
                    onChange={() => setFormCorrectIndex(1)}
                    className="w-4 h-4 text-[#6BCB77]"
                  />
                  <span className="font-black text-slate-600">B)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opción B"
                    value={formOptionB}
                    onChange={(e) => setFormOptionB(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={formCorrectIndex === 2}
                    onChange={() => setFormCorrectIndex(2)}
                    className="w-4 h-4 text-[#6BCB77]"
                  />
                  <span className="font-black text-slate-600">C)</span>
                  <input
                    type="text"
                    placeholder="Opción C"
                    value={formOptionC}
                    onChange={(e) => setFormOptionC(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={formCorrectIndex === 3}
                    onChange={() => setFormCorrectIndex(3)}
                    className="w-4 h-4 text-[#6BCB77]"
                  />
                  <span className="font-black text-slate-600">D)</span>
                  <input
                    type="text"
                    placeholder="Opción D"
                    value={formOptionD}
                    onChange={(e) => setFormOptionD(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Explicación / Fundamento Técnico:</label>
                <textarea
                  rows={2}
                  placeholder="Explica por qué la alternativa marcada es la correcta..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4D96FF]"
                />
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
                  className="px-5 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-black rounded-xl cursor-pointer"
                >
                  Guardar Pregunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk JSON Import */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileJson className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-lg text-slate-800">Carga Masiva de Preguntas (JSON)</h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Copia la plantilla JSON de ejemplo y pega tu arreglo de preguntas para alimentar el repositorio en segundos.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Ejemplo de Formato Esperado:</span>
                <button
                  onClick={handleCopyTemplate}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? "¡Copiado!" : "Copiar Plantilla"}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-900 text-purple-300 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-36">
                {jsonTemplateExample}
              </pre>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs">Pega tu Código JSON Aquí:</label>
              <textarea
                rows={8}
                placeholder="Pega aquí el arreglo JSON [... ] de preguntas..."
                value={bulkJsonText}
                onChange={(e) => setBulkJsonText(e.target.value)}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkImport}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Procesar e Importar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
