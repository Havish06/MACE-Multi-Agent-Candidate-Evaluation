# AI Hiring Panel

**AI Hiring Panel** is an adversarial, multi-agent evaluation platform that models an executive hiring committee. By orchestrating four distinct evaluator personas through structured dialectic debate and rigorous primary-document cross-examination, the system audits candidate claims, resolves disagreements, and produces evidence-weighted hiring decisions.

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

## Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js with Vite middleware.
- **AI / LLM Orchestration**: `@google/genai` TypeScript SDK (powered by `gemini-3.7-flash` with automatic fallback to `gemini-flash-latest`).
- **Audio Engine**: Web Speech API (`window.speechSynthesis`) with voice mapping and rate control.

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
