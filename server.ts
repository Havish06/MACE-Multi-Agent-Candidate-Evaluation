import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { SAMPLE_CANDIDATES } from "./src/data/sampleCandidates";
import {
  buildProfileAndEvidence,
  runIndependentAgents,
  detectDisagreements,
  runDebateEngine,
  runFinalAdjudicator,
} from "./server/engine";
import { getGemini } from "./server/gemini";
import { Modality } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Get benchmark candidates
  app.get("/api/benchmark-candidates", (_req, res) => {
    res.json({
      candidates: SAMPLE_CANDIDATES.map((c) => ({
        id: c.id,
        name: c.name,
        targetRole: c.targetRole,
        tagline: c.tagline,
        scenarioType: c.scenarioType,
        resumeRawText: c.resumeRawText,
        transcriptRawText: c.transcriptRawText,
        jobDescriptionRawText: c.jobDescriptionRawText,
        candidateProfile: c.candidateProfile,
        jobDescription: c.jobDescription,
        evidenceStore: c.evidenceStore,
      })),
    });
  });

  // Step 1: Extract profile + Evidence store + Contradictions from raw text/files
  app.post("/api/candidates/extract", async (req, res) => {
    try {
      const { resumeText, transcriptText, jobDescriptionText } = req.body;
      if (!resumeText || !jobDescriptionText) {
        return res.status(400).json({ error: "resumeText and jobDescriptionText are required" });
      }

      const result = await buildProfileAndEvidence(
        resumeText,
        transcriptText || "",
        jobDescriptionText
      );

      res.json(result);
    } catch (err: any) {
      console.error("Extraction error:", err);
      res.status(500).json({ error: err.message || "Failed to process candidate documents" });
    }
  });

  // Step 2: Run 4 independent isolated AI personas
  app.post("/api/candidates/evaluate-agents", async (req, res) => {
    try {
      const { profile, evidenceStore, jobDescription } = req.body;
      if (!profile || !evidenceStore || !jobDescription) {
        return res.status(400).json({ error: "profile, evidenceStore, and jobDescription are required" });
      }

      const assessments = await runIndependentAgents(profile, evidenceStore, jobDescription);
      res.json({ assessments });
    } catch (err: any) {
      console.error("Agent evaluation error:", err);
      res.status(500).json({ error: err.message || "Failed to evaluate candidate with independent personas" });
    }
  });

  // Step 3: Detect Disagreements
  app.post("/api/candidates/detect-disagreements", async (req, res) => {
    try {
      const { assessments, evidenceStore, jobDescription } = req.body;
      if (!assessments || !evidenceStore || !jobDescription) {
        return res.status(400).json({ error: "assessments, evidenceStore, and jobDescription are required" });
      }

      const disputes = await detectDisagreements(assessments, evidenceStore, jobDescription);
      res.json({ disputes });
    } catch (err: any) {
      console.error("Disagreement detection error:", err);
      res.status(500).json({ error: err.message || "Failed to detect disagreements" });
    }
  });

  // Step 4: Run Multi-Turn Debate with Position Revisions
  app.post("/api/candidates/run-debate", async (req, res) => {
    try {
      const { assessments, disputes, profile, evidenceStore, jobDescription } = req.body;
      if (!assessments || !disputes || !profile || !evidenceStore || !jobDescription) {
        return res.status(400).json({ error: "Missing required debate parameters" });
      }

      const result = await runDebateEngine(
        assessments,
        disputes,
        profile,
        evidenceStore,
        jobDescription
      );

      res.json(result);
    } catch (err: any) {
      console.error("Debate error:", err);
      res.status(500).json({ error: err.message || "Failed to run debate engine" });
    }
  });

  // Step 5: Final Adjudication (Non-averaging synthesis)
  app.post("/api/candidates/adjudicate", async (req, res) => {
    try {
      const { profile, jobDescription, evidenceStore, assessments, debateMessages, positionRevisions } = req.body;
      if (!profile || !jobDescription || !evidenceStore || !assessments) {
        return res.status(400).json({ error: "Missing required adjudication parameters" });
      }

      const finalDecision = await runFinalAdjudicator(
        profile,
        jobDescription,
        evidenceStore,
        assessments,
        debateMessages || [],
        positionRevisions || []
      );

      res.json({ finalDecision });
    } catch (err: any) {
      console.error("Adjudication error:", err);
      res.status(500).json({ error: err.message || "Failed to adjudicate final decision" });
    }
  });

  // Complete End-to-End Pipeline Execution
  app.post("/api/candidates/full-pipeline", async (req, res) => {
    try {
      const { resumeText, transcriptText, jobDescriptionText } = req.body;
      if (!resumeText || !jobDescriptionText) {
        return res.status(400).json({ error: "resumeText and jobDescriptionText are required" });
      }

      // Step 1: Extraction & Evidence Store
      const { profile, jobDescription, evidenceStore } = await buildProfileAndEvidence(
        resumeText,
        transcriptText || "",
        jobDescriptionText
      );

      // Step 2: Isolated 4-Agent Evaluation
      const assessments = await runIndependentAgents(profile, evidenceStore, jobDescription);

      // Step 3: Disagreement Detection
      const disputes = await detectDisagreements(assessments, evidenceStore, jobDescription);

      // Step 4: Multi-Turn Debate & Position Revisions
      const { debateMessages, positionRevisions, updatedAssessments } = await runDebateEngine(
        assessments,
        disputes,
        profile,
        evidenceStore,
        jobDescription
      );

      // Step 5: Final Adjudication
      const finalDecision = await runFinalAdjudicator(
        profile,
        jobDescription,
        evidenceStore,
        updatedAssessments,
        debateMessages,
        positionRevisions
      );

      res.json({
        profile,
        jobDescription,
        evidenceStore,
        independentAssessments: assessments,
        updatedAssessments,
        disputes,
        debateMessages,
        positionRevisions,
        finalDecision,
      });
    } catch (err: any) {
      console.error("Full pipeline error:", err);
      res.status(500).json({ error: err.message || "Full evaluation pipeline failed" });
    }
  });

  // TTS Generation for Voice Debate
  app.post("/api/tts-debate", async (req, res) => {
    try {
      const { speaker, text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required for TTS" });
      }

      const ai = getGemini();
      if (!ai) {
        return res.json({ useBrowserTTS: true });
      }

      // Map personas to Gemini voice names: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
      const voiceMap: Record<string, string> = {
        technical: "Kore", // Clear, intellectual female voice
        hr: "Zephyr", // Warm, articulate voice
        hiring_manager: "Charon", // Authoritative, measured voice
        skeptic: "Fenrir", // Deep, analytical voice
        adjudicator: "Puck", // Balanced, synthetic neutral voice
      };

      const voiceName = voiceMap[speaker] || "Zephyr";

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: text.slice(0, 500) }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({ audioBase64: base64Audio, voiceName });
        }
      } catch (ttsErr) {
        console.warn("Gemini TTS fallback to browser speech synthesis:", ttsErr);
      }

      res.json({ useBrowserTTS: true, voiceName });
    } catch (err: any) {
      res.json({ useBrowserTTS: true });
    }
  });

  // Vite middleware in development
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
    console.log(`MACE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
