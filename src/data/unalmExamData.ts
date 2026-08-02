export interface UNALMQuestion {
  id: string;
  subject: "Biología y Botánica" | "Química General" | "Física" | "Razonamiento Matemático" | "Razonamiento Verbal";
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Media" | "Avanzada" | "Nivel Cachimbo";
  molineroTip: string;
  xpValue: number;
}

export interface UNALMBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: string;
}

export const UNALM_SOLVED_EXAM_QUESTIONS: UNALMQuestion[] = [
  {
    id: "unalm_q1",
    subject: "Biología y Botánica",
    topic: "Citología y Plastidios Vegetales",
    question: "En una célula vegetal de la papa (Solanum tuberosum), ¿qué organela es la responsable directa de la síntesis y almacenamiento de grandes reservas de almidón?",
    options: ["Cloroplasto", "Amiloplasto", "Peroxisoma", "Vacuola central"],
    correctIndex: 1,
    explanation: "Los amiloplastos son plastidios incoloros especializadísimos en polimerizar glucosa para almacenar almidón en tubérculos, raíces y semillas.",
    difficulty: "Media",
    molineroTip: "⚠️ No confundir con el cloroplasto: el cloroplasto realiza fotosíntesis (contiene clorofila); el amiloplasto almacena energía no fotosintética.",
    xpValue: 120,
  },
  {
    id: "unalm_q2",
    subject: "Biología y Botánica",
    topic: "Histología Vegetal - Tejidos de Sostén",
    question: "¿Qué tejido vegetal vivo proporciona sostén mecánico y flexibilidad a los tallos jóvenes, pecíolos de hojas y brotes en crecimiento activo?",
    options: ["Esclerénquima", "Colénquima", "Xilema", "Parénquima clorofiliano"],
    correctIndex: 1,
    explanation: "El colénquima está formado por células vivas con paredes primarias engrosadas con pectina, ofreciendo plasticidad y soporte a partes jóvenes sin impedir el crecimiento.",
    difficulty: "Media",
    molineroTip: "💡 Regla mnemotécnica Molinera: Colénquima = Células VIVAS y flexibles. Esclerénquima = Células MUERTAS rígidas con lignina (fibras).",
    xpValue: 100,
  },
  {
    id: "unalm_q3",
    subject: "Biología y Botánica",
    topic: "Fotosíntesis - Fase Luminosa",
    question: "Durante la etapa fotoquímica en la membrana tilacoidal, la fotólisis del agua libera protones H+ y electrones. ¿Cuál es el aceptor final de electrones para formar el poder reductor?",
    options: ["NADP+", "ATP Sintasa", "Ribulosa 1,5-bisfosfato (RuBP)", "Citocromo b6f"],
    correctIndex: 0,
    explanation: "El NADP+ acepta 2 electrones transportados desde la fotosistema I más un protón H+ para transformarse en NADPH, la molécula clave que irá al Ciclo de Calvin.",
    difficulty: "Avanzada",
    molineroTip: "🎯 Pregunta fija de la Agraria: La fotólisis del agua produce el O₂ que respiramos y abastece electrones al PS II.",
    xpValue: 150,
  },
  {
    id: "unalm_q4",
    subject: "Química General",
    topic: "Estequiometría - Peso Equivalente",
    question: "En la reacción de neutralización total del ácido sulfúrico (H₂SO₄, Masa Molar = 98 g/mol) con NaOH, ¿cuál es el valor del peso equivalente (Eq-g) del H₂SO₄?",
    options: ["98 g/eq", "49 g/eq", "32.6 g/eq", "196 g/eq"],
    correctIndex: 1,
    explanation: "En los ácidos, el parámetro de carga θ es igual al número de hidrógenos ionizables (H⁺ = 2). Peso Eq = Masa Molar / θ = 98 / 2 = 49 g/eq.",
    difficulty: "Media",
    molineroTip: "⚡ Fórmula directa: P.Eq = M / (# de H⁺). Como el H₂SO₄ tiene 2 hidrógenos, dividimos 98 entre 2.",
    xpValue: 110,
  },
  {
    id: "unalm_q5",
    subject: "Química General",
    topic: "Química Orgánica - Nomenclatura Alcanos",
    question: "Aplica las reglas de la IUPAC para nombrar correctamente el siguiente hidrocarburo ramificado: CH₃-CH(CH₃)-CH₂-CH₃",
    options: ["2-metilbutano", "3-metilbutano", "Isopentano", "2-metilpropano"],
    correctIndex: 0,
    explanation: "La cadena principal más larga tiene 4 carbonos (butano). Numerando desde la izquierda para darle la menor posición posible al radical metilo (-CH₃ en C2), el nombre es 2-metilbutano.",
    difficulty: "Media",
    molineroTip: "📌 Recuerda: 'Isopentano' es nombre común/comercial. La Agraria pide siempre la nomenclatura IUPAC sistemática.",
    xpValue: 120,
  },
  {
    id: "unalm_q6",
    subject: "Física",
    topic: "Estática y Diagrama de Cuerpo Libre",
    question: "Un bloque de 50 N de peso descansa sobre una mesa horizontal lisa. Se le aplica una fuerza horizontal constante de 30 N hacia la derecha. ¿Cuánto vale la fuerza normal ejercida por la mesa?",
    options: ["30 N", "50 N", "80 N", "20 N"],
    correctIndex: 1,
    explanation: "En el eje Y no hay aceleración (equilibrio vertical): ΣFy = 0 ⇒ Normal - Peso = 0 ⇒ Normal = Peso = 50 N. La fuerza de 30 N solo afecta el eje X.",
    difficulty: "Media",
    molineroTip: "🧠 Descomposición cartesiana: No mezcles fuerzas del eje X (horizontal) con fuerzas del eje Y (vertical).",
    xpValue: 100,
  },
  {
    id: "unalm_q7",
    subject: "Razonamiento Matemático",
    topic: "Geometría Plana - Áreas Sombreadas",
    question: "En un cuadrado de lado L = 8 cm se encuentra inscrito un círculo perfecto. Halla el área de la región comprendida entre el cuadrado y el círculo.",
    options: ["(64 - 16π) cm²", "(16 - 4π) cm²", "(64 - 8π) cm²", "(32 - 16π) cm²"],
    correctIndex: 0,
    explanation: "Área del cuadrado = 8² = 64 cm². El radio del círculo inscrito es la mitad del lado: R = 4 cm. Área del círculo = π · 4² = 16π. Área sombreada = 64 - 16π cm².",
    difficulty: "Nivel Cachimbo",
    molineroTip: "📐 Truco Agrario: El diámetro del círculo inscrito siempre es igual al lado del cuadrado.",
    xpValue: 140,
  },
  {
    id: "unalm_q8",
    subject: "Razonamiento Matemático",
    topic: "Sucesiones Secundarias e Inducción",
    question: "Determina el número que completa lógicamente la siguiente secuencia: 3, 7, 13, 21, 31, ...",
    options: ["41", "43", "45", "47"],
    correctIndex: 1,
    explanation: "Calculando la primera diferencia: +4, +6, +8, +10. Las diferencias aumentan de 2 en 2. La siguiente diferencia será +12. Por lo tanto: 31 + 12 = 43.",
    difficulty: "Media",
    molineroTip: "🔍 En la Agraria, si la primera diferencia no es constante, busca la segunda diferencia (sucesión cuadrática).",
    xpValue: 110,
  }
];

export const UNALM_GAMIFIED_BADGES: UNALMBadge[] = [
  {
    id: "b1",
    name: "Semilla Molinera",
    description: "Completar la primera pregunta de examen de La Agraria",
    icon: "🌱",
    unlocked: true,
    category: "Inicial",
  },
  {
    id: "b2",
    name: "Botánico Experto",
    description: "Resolver 3 preguntas seguidas de Biología/Botánica sin cometer errores",
    icon: "🌿",
    unlocked: false,
    category: "Ciencias",
  },
  {
    id: "b3",
    name: "Alquimista Agrario",
    description: "Dominar los cálculos de Estequiometría y Masa Equivalente",
    icon: "🧪",
    unlocked: false,
    category: "Química",
  },
  {
    id: "b4",
    name: "Racha de Oro Molinero",
    description: "Lograr un combo de 5 respuestas correctas seguidas en el Simulacro UNALM",
    icon: "🔥",
    unlocked: false,
    category: "Rendimiento",
  },
  {
    id: "b5",
    name: "Ingresante La Molina",
    description: "Alcanzar el 80% o más de efectividad en la Maratón Resuelta de UNALM",
    icon: "🎓",
    unlocked: false,
    category: "Maestría",
  }
];
