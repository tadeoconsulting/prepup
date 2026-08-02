import { DailyTask } from "../types";

export interface CareerSubjectTopic {
  subject: string;
  topic: string;
  estimatedMinutes: number;
  priority: "Alta" | "Media" | "Baja";
  notes?: string;
}

export interface CareerBasePlan {
  careerCategory: string;
  keywords: string[];
  description: string;
  baseTopics: CareerSubjectTopic[];
}

export class CareerPlanRegistry {
  /**
   * Comprehensive base study plans for Peruvian entrance exams
   * categorized by main professional career branches.
   */
  public static CAREER_BASE_PLANS: CareerBasePlan[] = [
    {
      careerCategory: "Medicina Humana y Ciencias de la Salud",
      keywords: [
        "medicina",
        "salud",
        "enfermería",
        "enfermeria",
        "odontología",
        "odontologia",
        "estomatología",
        "estomatologia",
        "veterinaria",
        "nutrición",
        "nutricion",
        "farmacia",
        "bioquímica",
        "bioquimica",
        "obstetricia",
        "laboratorio"
      ],
      description: "Enfoque intensivo en Biología Humana, Genética, Química Orgánica, Física Médica y Lectura Crítica DECO.",
      baseTopics: [
        {
          subject: "Biología",
          topic: "Biología Celular: Estructura, Organelas y Respiración Celular",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Tema clave en preguntas DECO San Marcos y Cayetano Heredia."
        },
        {
          subject: "Biología",
          topic: "Genética Mendeliana, Leyes de Mendel y Herencia Humana",
          estimatedMinutes: 50,
          priority: "Alta",
          notes: "Resolver ejercicios de cruces monohíbridos y dihíbridos."
        },
        {
          subject: "Anatomía",
          topic: "Sistema Cardiovascular y Circulación Sanguínea Humana",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Revisar anatomía del corazón, vasos y composición de la sangre."
        },
        {
          subject: "Química",
          topic: "Química Orgánica: Hidrocarburos, Alcanos, Alquenos y Alquinos",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Nomenclatura IUPAC y fórmulas estructurales."
        },
        {
          subject: "Química",
          topic: "Estequiometría, Reactivo Limitante y Rendimiento de Reacciones",
          estimatedMinutes: 40,
          priority: "Media",
          notes: "Cálculos moleculares y relaciones en masa."
        },
        {
          subject: "Física",
          topic: "Hidrostática, Presión y Principio de Pascal / Arquímedes",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Aplicación a la presión sanguínea y fluidos en el cuerpo."
        },
        {
          subject: "Lectura Crítica",
          topic: "Comprensión de Textos Científicos y Divulgación Biológica",
          estimatedMinutes: 30,
          priority: "Alta",
          notes: "Análisis de hipótesis e inferencias en párrafos DECO."
        },
        {
          subject: "Razonamiento Matemático",
          topic: "Regla de Tres Compuesta y Razones de Proporcionalidad",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Cálculo de dosis e índices biomédicos."
        }
      ]
    },
    {
      careerCategory: "Ingenierías y Ciencias Exactas",
      keywords: [
        "ingeniería",
        "ingenieria",
        "sistemas",
        "civil",
        "industrial",
        "mecatrónica",
        "mecatronica",
        "minas",
        "mecánica",
        "mecanica",
        "electrónica",
        "electronica",
        "software",
        "computación",
        "computacion",
        "física",
        "fisica",
        "matemática",
        "matematica",
        "eléctrica",
        "electrica"
      ],
      description: "Alto rigor matematico en Álgebra, Geometría del Espacio, Trigonometría, Mecánica Física y Química Inorgánica.",
      baseTopics: [
        {
          subject: "Matemáticas",
          topic: "Álgebra: Ecuaciones Cuadráticas, Funciones y Dominio/Rango",
          estimatedMinutes: 50,
          priority: "Alta",
          notes: "Fundamental para exámenes tipo UNI y San Marcos."
        },
        {
          subject: "Matemáticas",
          topic: "Geometría del Espacio: Poliedros, Prismas, Pirámides y Volúmenes",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Visualización espacial e identidades de sólidos."
        },
        {
          subject: "Trigonometría",
          topic: "Identidades Trigonométricas Fundamentales y de Ángulo Doble",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Simplificación de expresiones trigonométricas complejas."
        },
        {
          subject: "Física",
          topic: "Mecánica: Dinámica, Leyes de Newton y Diagrama de Cuerpo Libre",
          estimatedMinutes: 50,
          priority: "Alta",
          notes: "Análisis de fuerzas de rozamiento, tensión y plano inclinado."
        },
        {
          subject: "Física",
          topic: "Trabajo, Energía Mecánica y Conservación de la Energía",
          estimatedMinutes: 40,
          priority: "Media",
          notes: "Cálculo de energía cinética, potencial e impulsos."
        },
        {
          subject: "Química",
          topic: "Tabla Periódica, Enlaces Químicos e Hibridación",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Geometría molecular y propiedades periódicas."
        },
        {
          subject: "Razonamiento Matemático",
          topic: "Sucesiones, Series Numéricas y Análisis Combinatorio",
          estimatedMinutes: 35,
          priority: "Alta",
          notes: "Lógica inductiva y deducción rápida de patrones."
        },
        {
          subject: "Lectura Crítica",
          topic: "Comprensión Lógico-Argumentativa y Coherencia Textual",
          estimatedMinutes: 30,
          priority: "Media",
          notes: "Identificación de premisas, tesis y conclusión."
        }
      ]
    },
    {
      careerCategory: "Derecho, Ciencias Políticas y Humanidades",
      keywords: [
        "derecho",
        "políticas",
        "politicas",
        "comunicación",
        "comunicacion",
        "periodismo",
        "historia",
        "filosofía",
        "filosofia",
        "literatura",
        "lingüística",
        "linguistica",
        "sociología",
        "sociologia",
        "relaciones internacionales"
      ],
      description: "Énfasis en Lectura Crítica, Educación Cívica, Constitución Política, Historia del Perú y Sintaxis Castellana.",
      baseTopics: [
        {
          subject: "Lectura Crítica",
          topic: "Textos Filosóficos y Discursos Argumentativos Complejos",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Evaluación de postura del autor, falacias y presuposiciones."
        },
        {
          subject: "Educación Cívica",
          topic: "Constitución Política del Perú: Derechos Fundamentales y Garantías",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Habeas Corpus, Habeas Data y Acción de Amparo."
        },
        {
          subject: "Educación Cívica",
          topic: "Organización del Estado Peruano: Poderes Ejecutivo, Legislativo y Judicial",
          estimatedMinutes: 35,
          priority: "Alta",
          notes: "Funciones constitucionales y organismos autónomos."
        },
        {
          subject: "Lenguaje",
          topic: "Sintaxis Castellana: Sujeto, Predicado y Oración Compuesta",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Identificación de proposiciones subordinadas y coordinadas."
        },
        {
          subject: "Historia del Perú",
          topic: "Tahuantinsuyo, Conquista y Organización del Virreinato Peruano",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Instituciones virreinales y proceso de independencia."
        },
        {
          subject: "Historia Universal",
          topic: "Guerra Fría, Descolonización y Configuración del Mundo Contemporáneo",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Conflictos internacionales del siglo XX."
        },
        {
          subject: "Literatura",
          topic: "Generación del 50 Peruana: Julio Ramón Ribeyro y Mario Vargas Llosa",
          estimatedMinutes: 30,
          priority: "Media",
          notes: "Análisis de 'Los gallinazos sin plumas' y obras clave."
        },
        {
          subject: "Razonamiento Verbal",
          topic: "Eliminación de Oraciones y Inclusión de Enunciados",
          estimatedMinutes: 30,
          priority: "Media",
          notes: "Cohesión, pertinencia y redundancia textual."
        }
      ]
    },
    {
      careerCategory: "Economía, Administración y Negocios",
      keywords: [
        "administración",
        "administracion",
        "economía",
        "economia",
        "contabilidad",
        "finanzas",
        "marketing",
        "negocios",
        "gestión",
        "gestion",
        "empresarial"
      ],
      description: "Balance entre Aritmética Comercial, Estadística, Microeconomía, Razonamiento Cuantitativo y Lectura Crítica.",
      baseTopics: [
        {
          subject: "Aritmética",
          topic: "Porcentajes, Varación Porcentual e Interés Simple y Compuesto",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Problemas reales de utilidades, préstamos y rentabilidad."
        },
        {
          subject: "Economía",
          topic: "Ley de Oferta y Demanda, Equilibrio de Mercado y Elasticidad",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Gráficos de mercado y comportamiento de consumidores."
        },
        {
          subject: "Economía",
          topic: "Agregados Económicos: PBI, Inflación, Tasa de Desempleo y Comercio Exterior",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Poder adquisitivo, exportaciones e importaciones."
        },
        {
          subject: "Razonamiento Matemático",
          topic: "Interpretación de Gráficos Estadísticos y Cuadros de Frecuencias",
          estimatedMinutes: 35,
          priority: "Alta",
          notes: "Lectura rápida de diagramas de barras, sectores y tendencias."
        },
        {
          subject: "Matemáticas",
          topic: "Estadística Descriptiva: Media, Mediana, Moda y Varianza",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Medidas de tendencia central y dispersión."
        },
        {
          subject: "Lectura Crítica",
          topic: "Redacción Empresarial y Análisis de Informes Económicos",
          estimatedMinutes: 30,
          priority: "Media",
          notes: "Extracción de conclusiones a partir de datos corporativos."
        },
        {
          subject: "Educación Cívica",
          topic: "Sistema Financiero Peruano, SBS, BCRP y Tributación (SUNAT)",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Mecanismos de recaudación e inflación monetaria."
        }
      ]
    },
    {
      careerCategory: "Agronomía, Ciencias Ambientales y Biología",
      keywords: [
        "agronomía",
        "agronomia",
        "ambiental",
        "botánica",
        "botanica",
        "zootecnia",
        "forestal",
        "agrícola",
        "agricola",
        "industrias alimentarias",
        "ecología",
        "ecologia",
        "meteorología",
        "meteorologia"
      ],
      description: "Modelos específicos para UNALM La Molina y facultades agrícolas: Botánica, Química Orgánica, Ecología y Razonamiento Molinero.",
      baseTopics: [
        {
          subject: "Biología / Botánica",
          topic: "Anatomía y Fisiología Vegetal: Fotosíntesis C3/C4/CAM y Xilema/Floema",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Núcleo de preguntas para el examen de la Agraria (UNALM)."
        },
        {
          subject: "Ecología",
          topic: "Ecosistemas, Cadenas Tróficas y Ciclos Biogeoquímicos (Carbono, Nitrógeno)",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Impacto ambiental y conservación de la biodiversidad peruana."
        },
        {
          subject: "Química",
          topic: "Química Orgánica: Reacciones de Funciones Oxigenadas (Alcoholes, Ácidos)",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Fundamento de bioquímica y alimentos."
        },
        {
          subject: "Física",
          topic: "Calorimetría, Termodinámica y Cambios de Fase",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Transferencia de calor en ambientes agrícolas."
        },
        {
          subject: "Razonamiento Matemático",
          topic: "Planteo de Ecuaciones y Problemas de Mezclas y Aleaciones",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Típico formato del examen UNALM La Molina."
        },
        {
          subject: "Matemáticas",
          topic: "Álgebra: Logaritmos y Funciones Exponenciales",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Modelado de crecimiento poblacional y biológico."
        }
      ]
    },
    {
      careerCategory: "Arquitectura, Arte y Diseño",
      keywords: [
        "arquitectura",
        "diseño",
        "diseno",
        "arte",
        "urbanismo",
        "interiores",
        "gráfico",
        "grafico"
      ],
      description: "Sólida preparación en Geometría Descriptiva, Perspectiva, Estática Estructural e Historia del Arte.",
      baseTopics: [
        {
          subject: "Geometría",
          topic: "Geometría Descriptiva: Vistas Tridimensionales, Isometría y Perspectiva",
          estimatedMinutes: 50,
          priority: "Alta",
          notes: "Representación plana de volúmenes espaciales."
        },
        {
          subject: "Trigonometría",
          topic: "Resolución de Triángulos Oblicuángulos: Ley de Senos y Cosenos",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Cálculo de distancias y levantamiento de áreas."
        },
        {
          subject: "Física",
          topic: "Estática: Condición de Equilibrio y Momentos de Fuerza (Torque)",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Base estructural para vigas y construcciones."
        },
        {
          subject: "Historia del Arte",
          topic: "Arquitectura e Historia Peruana: Chavín, Caral, Inca y Virreinal",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Estructuras prehispánicas y estilos coloniales."
        },
        {
          subject: "Lectura Crítica",
          topic: "Análisis de Ensayos Sobre Estética, Espacio Urbano y Sociedad",
          estimatedMinutes: 30,
          priority: "Media",
          notes: "Comprensión de crítica arquitectónica."
        }
      ]
    },
    {
      careerCategory: "Psicología y Ciencias Sociales",
      keywords: [
        "psicología",
        "psicologia",
        "trabajo social",
        "antropología",
        "antropologia",
        "educación",
        "educacion"
      ],
      description: "Preparación centrada en Procesos Cognitivos, Neuropsicología, Filosofía, Lectura Crítica y Biología del Sistema Nervioso.",
      baseTopics: [
        {
          subject: "Psicología",
          topic: "Procesos Cognitivos: Memoria, Atención, Aprendizaje y Percepción",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Modelos teóricos de Piaget, Vygotsky y psicología cognitiva."
        },
        {
          subject: "Psicología",
          topic: "Bases Biológicas de la Conducta: Sistema Nervioso y Neurotransmisores",
          estimatedMinutes: 45,
          priority: "Alta",
          notes: "Encéfalo, lóbulo cerebral y conducta humana."
        },
        {
          subject: "Filosofía",
          topic: "Gnoseología y Epistemología: Teorías del Conocimiento Científico",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Racionalismo, empirismo y método científico."
        },
        {
          subject: "Lectura Crítica",
          topic: "Comprensión de Ensayos Psicológicos y Análisis de Casos Sociales",
          estimatedMinutes: 40,
          priority: "Alta",
          notes: "Preguntas de interpretación y extrapolación."
        },
        {
          subject: "Biología",
          topic: "Sistema Endocrino: Hormonas y Regulación del Comportamiento",
          estimatedMinutes: 35,
          priority: "Media",
          notes: "Eje hipotálamo-hipófisis."
        }
      ]
    }
  ];

  /**
   * Returns the matching base study plan topics for a given career name.
   * If no specific keyword matches, returns a balanced general pre-university base curriculum.
   */
  public static getBaseTasksForCareer(careerName: string, todayIsoDate?: string): DailyTask[] {
    const cleanCareer = (careerName || "").toLowerCase().trim();
    const today = todayIsoDate || new Date().toISOString().split("T")[0];

    // Find matching category by keyword
    const matchedPlan = this.CAREER_BASE_PLANS.find((plan) =>
      plan.keywords.some((kw) => cleanCareer.includes(kw))
    );

    const baseList = matchedPlan ? matchedPlan.baseTopics : this.CAREER_BASE_PLANS[0].baseTopics;

    // Convert to DailyTask objects with completed ALWAYS false (as required by prompt)
    return baseList.map((item, idx) => ({
      id: `task_${Date.now()}_${idx + 1}`,
      date: today,
      subject: item.subject,
      topic: item.topic,
      estimatedMinutes: item.estimatedMinutes,
      completed: false, // CRITICAL: NEVER pre-check tasks, student must check them!
      priority: item.priority,
      notes: item.notes || `Materia base recomendada para ${careerName || "tu examen de admisión"}.`
    }));
  }
}
