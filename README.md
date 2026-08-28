# MACE — Multi-Agent Committee Evaluator

**MACE** is an adversarial, multi-agent evaluation platform that models an executive hiring committee. By orchestrating four distinct evaluator personas through structured dialectic debate and rigorous primary-document cross-examination, the system audits candidate claims, resolves disagreements, and produces evidence-weighted hiring decisions.

---

## Key Features

### 1. 4-Persona Independent Evaluation
Before deliberation begins, four independent agents assess the candidate dossier without cross-contamination:
- **Principal Technical Architect** (`Dr. Elena Rostova`): Evaluates systems architecture, code quality, technical complexity, and testing discipline.
- **Head of People & Culture** (`Marcus Vance-Cole`): Assesses collaboration, leadership trajectory, cultural stewardship, and communication clarity.
- **Hiring Manager & Engineering Lead** (`David Sterling`): Analyzes immediate project delivery, velocity, operational pragmatism, and role calibration.
- **Chief Evaluation Skeptic & Risk Auditor** (`Arthur Pendelton`): Adversarially cross-examines claims against primary documents to detect GPA embellishment, scope inflation, or unverified claims.

### 2. Evidence Store & Contradiction Detection
- Extracts primary text excerpts from resumes, transcripts, and portfolios with unique citation IDs (e.g., `[E001]`, `[E005]`).
- Automatically correlates self-reported claims against registrar records and primary artifacts to flag direct discrepancies and unbacked assertions.

### 3. Live Adversarial Debate Arena & Multi-Voice Synthesis
- **Multi-Round Dialectic**: Evaluators challenge assumptions, present counter-evidence, defend their stances, or calibrate confidence scores based on peer arguments.
- **Browser Speech Synthesis**: Built-in audio playback using distinct pitches, speeds, and browser voices for each committee member.
- **Real-Time Speed & Navigation Controls**: 1.0x, 1.25x, and 1.5x playback speeds, individual turn audio triggers, and next/previous turn stepping.

### 4. Chief Adjudicator Final Consensus Report
- **Executive Decision**: Outputs weighted recommendations (`STRONG_HIRE`, `HIRE`, `LEAN_HIRE`, `NO_HIRE`, `STRONG_NO`) with overall confidence metrics.
- **Resolved vs. Unresolved Disagreements**: Transparently tracks committee convergence and minority dissent.
- **Hiring Rubric Scoring**: Evaluates candidates across Technical Depth, Foundation, Communication, and Data Accuracy.
- **Targeted Follow-Up Interview Questions**: Generates high-yield interview questions designed to probe specific unbacked claims or architecture boundaries.
- **Export Capabilities**: Supports clean print and PDF dossier export.

---

## System Architecture

MACE models an executive hiring committee through an adversarial 5-stage evaluation pipeline. Instead of relying on a single prompt or averaging scores together, MACE isolates specialist AI agents, detects disagreements, conducts turn-based dialectic debates, and produces evidence-grounded adjudication dossiers.

```
                                      ┌────────────────────────────────────────┐
                                      │   Input Documents                      │
                                      │   (Resume, JD, Official Transcript)    │
                                      └──────────────────┬─────────────────────┘
                                                         │
                                                         ▼
                                 ┌─────────────────────────────────────────────────┐
                                 │ STAGE 1: Ground-Truth Evidence Store            │
                                 │ • Atomic claim extraction with citation IDs     │
                                 │ • Cross-document discrepancy auditing (E001...) │
                                 └───────────────────────┬─────────────────────────┘
                                                         │
                        ┌────────────────────────────────┴────────────────────────────────┐
                        │                                                                 │
                        ▼ STAGE 2: Zero-Anchor Isolated Specialist Pass                   ▼
       ┌───────────────────────────────┐                             ┌───────────────────────────────┐
       │      Technical Architect      │                             │     Culture & Behavioral      │
       │   (Systems, Algorithms, CS)   │                             │  (Humility, Comms, Dynamics)  │
       └───────────────┬───────────────┘                             └───────────────┬───────────────┘
                       │                                                             │
                       │               ┌───────────────────────────────┐             │
                       │               │     Hiring Manager Lead       │             │
                       ├──────────────►│    (Velocity, Product, ROI)   │◄────────────┤
                       │               └───────────────┬───────────────┘             │
                       │                               │                             │
                       │               ┌───────────────▼───────────────┐             │
                       │               │     Risk & Auditor Lead       │             │
                       └──────────────►│ (Integrity, Tenure, Padding)  │◄────────────┘
                                       └───────────────┬───────────────┘
                                                       │
                                                       ▼
                                 ┌─────────────────────────────────────────────────┐
                                 │ STAGE 3: Disagreement & Variance Engine         │
                                 │ • Calculates mathematical variance (Vd >= 1.5)  │
                                 │ • Identifies core philosophical tensions        │
                                 └─────────────────────┬───────────────────────────┘
                                                       │
                                                       ▼
                                 ┌─────────────────────────────────────────────────┐
                                 │ STAGE 4: Multi-Turn Adversarial Voice Debate    │
                                 │ • Challenge, rebuttal & position revisions      │
                                 │ • Multi-voice browser speech synthesis          │
                                 └─────────────────────┬───────────────────────────┘
                                                       │
                                                       ▼
                                 ┌─────────────────────────────────────────────────┐
                                 │ STAGE 5: Evidence-Weighted Adjudication         │
                                 │ • Non-averaging verdict (Strong/Lean Hire/No)   │
                                 │ • Confidence rating & risk mitigation terms     │
                                 └─────────────────────┬───────────────────────────┘
                                                       │
                                                       ▼
                                 ┌─────────────────────────────────────────────────┐
                                 │ Persistence & UI Layer                          │
                                 │ • Firestore Cloud Sync / Local Cache            │
                                 │ • Interactive Dossier, Citations, a11y UI       │
                                 └─────────────────────────────────────────────────┘
```

### Core Pipeline Stages

1. **Ground-Truth Ingestion & Citation Indexing**: Ingests primary candidate documents (resume, transcript, job description) and builds a tamper-evident citation store (`E001`, `E002`, etc.) with strict line-level indices and contradiction flags.
2. **Isolated Specialist Evaluation (Zero-Anchor Guarantee)**: Four specialist personas evaluate the candidate in parallel isolated context windows to prevent peer anchoring bias and halo effects.
3. **Mathematical Disagreement Detection**: Measures statistical variance across rubric dimensions ($V_d \ge 1.5$) to highlight core philosophical conflicts (e.g., technical execution vs. integrity risk).
4. **Multi-Turn Adversarial Voice Debate**: Turn-based dialectic where agents challenge claims, defend hypotheses with document citations, revise positions, and play back through multi-voice speech synthesis.
5. **Evidence-Weighted Non-Averaging Adjudication**: Synthesizes verified primary records ($W=1.0$), discounts unsubstantiated claims ($W=0.35$), and applies risk penalty thresholding to render a definitive hiring verdict.

---

## Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js with Vite middleware.
- **AI / LLM Orchestration**: `@google/genai` TypeScript SDK (powered by `gemini-3.7-flash` with automatic fallback to `gemini-flash-latest`).
- **Audio Engine**: Web Speech API (`window.speechSynthesis`) with voice mapping and rate control.
- **Testing & Quality Assurance**: Vitest, React Testing Library, JSDOM.

---

## Automated Testing & Quality Audit

The codebase includes an end-to-end automated test suite covering unit logic, component rendering, accessibility compliance, evidence mapping, and security boundaries:

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Suite Coverage
- `src/__tests__/evidenceStore.test.ts`: Validates unique citation IDs (`E001`, `E002`), cross-document contradiction extraction, and registrar transcript correlation.
- `src/__tests__/adjudication.test.ts`: Verifies non-averaging consensus synthesis, 4-persona assessment generation, position calibration, and rubric score enforcement (1–5 scale).
- `src/__tests__/components.test.tsx`: Validates UI component rendering, WAI-ARIA tab navigation (`role="tablist"`, `role="tab"`), dialog focus management, and button accessibility.
- `src/__tests__/security.test.ts`: Ensures rigorous input sanitization, prompt injection resistance, score bounds clamping (`[0, 100]` / `[1, 5]`), and schema conformity.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key (configured in environment)

### Environment Setup
Create a `.env` file or export the Gemini API key:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Installation
```bash
npm install
```

### Running Locally
```bash
# Start development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## Pre-Loaded Benchmark Scenarios

The system includes three benchmark candidate profiles demonstrating varied evaluation dynamics:
1. **Alex Rivera (Controversial Split Decision)**: Senior AI Systems Engineer with high technical delivery but noticeable academic and tenure discrepancies that trigger lively committee debate.
2. **Sarah Chen (Summa Cum Laude High-Performer)**: Full Stack Engineer with verified primary source documentation and unanimous committee consensus.
3. **Marcus Vance (Severe Discrepancy & Integrity Flag)**: Senior DevOps applicant with self-reported 3.90 GPA contradicting an official 2.74 transcript record, illustrating skeptical audit detection.
