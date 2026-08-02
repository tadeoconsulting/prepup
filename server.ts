import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily / safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint: Download compiled ZIP for cPanel or static hosting
app.get("/download-zip", (_req, res) => {
  const filePath = path.join(process.cwd(), "dist.zip");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "dist.zip");
  } else {
    res.status(404).json({ error: "dist.zip no encontrado. Ejecuta la compilación primero." });
  }
});

// Endpoint: Download full source code project as ZIP
app.get("/api/download-source", (_req, res) => {
  try {
    const pythonScript = `import zipfile, os
zip_filename = 'proyecto-completo.zip'
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root or 'dist' in root or '.git' in root or '.cache' in root:
            continue
        for file in files:
            if file.endswith('.zip') or file.endswith('.tar.gz'):
                continue
            filepath = os.path.join(root, file)
            z.write(filepath, os.path.relpath(filepath, '.'))
`;
    execSync(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`, { cwd: process.cwd() });
    const filePath = path.join(process.cwd(), "proyecto-completo.zip");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=proyecto-completo.zip");
      return res.download(filePath, "proyecto-completo.zip");
    } else {
      return res.status(500).json({ error: "No se pudo generar el archivo ZIP." });
    }
  } catch (err: any) {
    console.error("Error creating source zip:", err);
    return res.status(500).json({ error: "Error al empaquetar el código fuente", details: err.message });
  }
});

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint: Generate Custom Mock Exam Questions via Gemini
app.post("/api/ai/generate-simulacro", async (req, res) => {
  try {
    const { country, university, career, subject, questionCount = 5, difficulty = "Media" } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: "API Key de Gemini no configurada",
        message: "Operando en modo de respaldo local para preguntas.",
      });
    }

    const prompt = `Crea un minisimulacro de examen de ingreso universitario adaptado para:
- País: ${country || "Latinoamérica"}
- Universidad / Sistema: ${university || "General Latam"}
- Carrera deseada: ${career || "General"}
- Materia focal: ${subject || "Razonamiento Lógico y Matemático"}
- Cantidad de preguntas: ${questionCount}
- Nivel de dificultad: ${difficulty}

Genera un JSON con preguntas de opción múltiple relevantes y realistas para exámenes tipo admisión preuniversitaria (ej. tipo ICFES, UNAM, San Marcos, PAES, EXANI). Cada pregunta debe tener enunciado claro, 4 opciones (A, B, C, D), índice de la respuesta correcta (0 para A, 1 para B, 2 para C, 3 para D), y una explicación detallada paso a paso.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Eres un profesor especialista en exámenes de admisión preuniversitarios de Latinoamérica (UNAM, San Marcos, ICFES, PAES, UBA, etc.). Responde estrictamente en formato JSON válido según el esquema solicitado.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctIndex", "explanation", "topic"],
              },
            },
          },
          required: ["title", "subject", "questions"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating simulacro with Gemini:", error);
    res.status(500).json({ error: "Error al generar simulacro con IA", details: error.message });
  }
});

// Endpoint: Explain a specific question or topic
app.post("/api/ai/explain-topic", async (req, res) => {
  try {
    const { topic, subject, doubt, targetExam } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({ error: "Gemini API key unavailable" });
    }

    const prompt = `Explicación académica clara, motivadora y fácil de entender para un estudiante de 15 a 16 años de secundaria/preparatoria en Latinoamérica.
Materia: ${subject}
Tema: ${topic}
Duda específica del estudiante: ${doubt || "Explícame los conceptos clave y cómo suele venir este tema en el examen de admisión."}
Examen de referencia: ${targetExam || "Examen de ingreso universitario"}

Estructura la respuesta en Markdown con:
1. Concepto clave resumido en 2 oraciones.
2. Fórmula o Regla de oro (si aplica).
3. Ejemplo resuelto paso a paso típico de examen.
4. Consejo trampa / Error común a evitar en el examen.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Eres el mejor tutor preuniversitario de Latinoamérica: empático, directo, claro y enfocado en que el alumno de 15-16 años gane confianza y técnica de examen.",
      },
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error explaining topic:", error);
    res.status(500).json({ error: "Error al generar explicación", details: error.message });
  }
});

// Endpoint: Generate Personalized Study Roadmap
app.post("/api/ai/generate-roadmap", async (req, res) => {
  try {
    const { country, university, career, months, dailyHours, weakSubjects } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({ error: "Gemini API key unavailable" });
    }

    const prompt = `Diseña un plan estratégico de estudio preuniversitario de ${months} meses para un estudiante latinoamericano de 15-16 años.
- País: ${country}
- Universidad/Examen: ${university}
- Carrera Objetivo: ${career}
- Horas diarias disponibles: ${dailyHours} horas
- Materias o áreas con menor dominio inicial: ${weakSubjects ? weakSubjects.join(", ") : "Por definir"}

Devuelve un JSON estructurado con las fases recomendadas (ej. Fase 1: Diagnóstico y Fundamentos, Fase 2: Profundización por Temas, Fase 3: Simulacros Intensivos), junto con objetivos semanales sugeridos y prioridades de materias.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmapTitle: { type: Type.STRING },
            recommendedDailyHours: { type: Type.NUMBER },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  durationWeeks: { type: Type.INTEGER },
                  focusGoal: { type: Type.STRING },
                  weeklyTasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["phaseNumber", "title", "durationWeeks", "focusGoal", "weeklyTasks"],
              },
            },
            keyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["roadmapTitle", "phases", "keyRecommendations"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Error al generar plan", details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
