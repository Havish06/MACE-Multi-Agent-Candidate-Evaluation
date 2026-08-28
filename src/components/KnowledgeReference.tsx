import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileText, CheckCircle2, ShieldCheck, Scale, Users, Sparkles } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  keywords: string[];
}

const FAQ_ENTRIES: FAQItem[] = [
  {
    id: 'faq-what-is-mace',
    question: 'What is MACE (Multi-Agent Committee Evaluator)?',
    shortAnswer: 'MACE is an explainable AI hiring platform that replaces single-prompt screening with a 4-agent adversarial hiring committee.',
    fullAnswer: 'MACE (Multi-Agent Committee Evaluator) is an enterprise-grade AI candidate evaluation platform powered by Google Gemini 3.7 Flash. Rather than relying on a black-box average score or single prompt, MACE coordinates four isolated specialist AI personas (Technical Architect, Culture Lead, Hiring Manager Lead, and Risk Auditor) who independently evaluate candidate documents, debate disagreements, and synthesize an evidence-grounded adjudication dossier.',
    keywords: ['MACE', 'Multi-Agent Committee Evaluator', 'Explainable AI', 'AI Hiring Committee', 'Adjudication Dossier'],
  },
  {
    id: 'faq-how-disagreements-resolved',
    question: 'How does MACE resolve hiring disagreements without groupthink?',
    shortAnswer: 'MACE enforces zero-anchor isolated evaluations, detects statistical variance across agent rubrics, and triggers structured dialectic debate.',
    fullAnswer: 'To prevent anchoring bias and groupthink, MACE executes Stage 1 evaluations in parallel, isolated context windows where no agent can see peer scores. The system calculates variance across rubric dimensions; when disagreement exceeds the contention threshold (variance >= 1.5), agents engage in a turn-based adversarial debate cross-examining claims against ground-truth document citations.',
    keywords: ['Disagreement Detection', 'Zero-Anchor Evaluation', 'Dialectic Debate', 'Anti-Groupthink', 'Rubric Variance'],
  },
  {
    id: 'faq-evidence-weighted-adjudication',
    question: 'Why is evidence-weighted adjudication superior to score averaging?',
    shortAnswer: 'Score averaging dilutes critical disqualifying signals; MACE weights arguments based on verified primary record citations.',
    fullAnswer: 'Traditional candidate scoring averages numerical ratings, causing severe disqualifying flags (such as credentials falsification or lack of core systems experience) to be averaged away. The MACE Adjudicator uses a non-averaging evidence engine that weights arguments by evidentiary proof (primary transcripts, code repositories, verified work logs) rather than rhetorical confidence.',
    keywords: ['Evidence-Weighted Adjudication', 'Non-Averaging Scoring', 'Primary Document Citations', 'Hiring Integrity'],
  },
  {
    id: 'faq-contradiction-detection',
    question: 'How does MACE detect discrepancies between resumes and official transcripts?',
    shortAnswer: 'MACE constructs an atomic citation store with line-level indices and cross-references self-reported claims against transcripts.',
    fullAnswer: 'During document ingestion, MACE extracts atomic factual claims (GPA, degree conferral dates, tech stacks, job titles) and cross-references them against official university transcripts and third-party records. Any discrepancy is assigned a tamper-evident citation ID (e.g. E001) with severity grading (Minor, Moderate, Critical) and transparent audit diffs.',
    keywords: ['Resume Verification', 'Transcript Cross-Examination', 'Contradiction Analysis', 'Audit Trail'],
  },
  {
    id: 'faq-agent-personas',
    question: 'What specialist roles make up the MACE AI Committee?',
    shortAnswer: 'The committee includes a Technical Architect, Culture Lead, Hiring Manager Lead, and Risk Auditor.',
    fullAnswer: '1. Technical Architect (Dr. Aris Thorne): Rigorous systems architecture, algorithms, and technical scalability. 2. Culture & Behavioral Lead (Elena Vance): Psychological safety, communication, humility, and cross-functional empathy. 3. Hiring Manager Lead (Marcus Sterling): Commercial velocity, business delivery milestones, and product impact. 4. Risk & Integrity Auditor (Judge Evelyn Ross): Factual consistency, credential validation, and tenure gap analysis.',
    keywords: ['Evaluator Personas', 'Technical Architect', 'Culture Lead', 'Hiring Manager', 'Risk Auditor'],
  },
];

export const KnowledgeReference: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="system-reference-faq"
      aria-labelledby="reference-heading"
      className="mt-8 border border-[#121212]/15 bg-[#FFFFFF] rounded-sm p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#121212]/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#121212]/5 flex items-center justify-center text-[#121212]">
            <HelpCircle className="w-4 h-4 text-[#D94F33]" />
          </div>
          <div>
            <h2 id="reference-heading" className="text-base sm:text-lg font-serif-editorial font-bold text-[#121212]">
              MACE System Architecture & Knowledge Reference
            </h2>
            <p className="text-xs text-[#57534E]">
              Core architectural principles, explainable hiring rubrics, and answer-shaped documentation for AI evaluators and search engines.
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-knowledge-reference"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="knowledge-reference-content"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121212] bg-[#F4F1EA] hover:bg-[#EAE5DC] border border-[#121212]/15 rounded-xs transition-colors cursor-pointer shrink-0"
        >
          <span>{isOpen ? 'Collapse Reference' : 'Expand Reference'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div id="knowledge-reference-content" className="mt-5 space-y-6 pt-2">
          {/* Quick Definition Callout for Search & LLMs */}
          <div className="p-4 bg-[#F4F1EA]/80 border border-[#121212]/10 rounded-xs">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#D94F33] block mb-1">
              Direct Definition & Abstract
            </span>
            <p className="text-sm font-serif-editorial text-[#121212] leading-relaxed">
              <strong>MACE (Multi-Agent Committee Evaluator)</strong> is an adversarial hiring intelligence platform that models executive hiring committee deliberations through four independent specialist AI personas, multi-turn dialectic debate, and evidence-weighted adjudication powered by Google Gemini 3.7 Flash.
            </p>
          </div>

          {/* Key Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#FDFCFB] border border-[#121212]/10 rounded-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212] font-serif-editorial text-sm mb-1.5">
                <Users className="w-4 h-4 text-[#D94F33]" />
                <h3>Zero-Anchor Isolation</h3>
              </div>
              <p className="text-[#57534E] leading-relaxed">
                Initial evaluation pass is executed in isolated context windows. No agent sees peer evaluations, preventing consensus bias and halo effects.
              </p>
            </div>

            <div className="p-3.5 bg-[#FDFCFB] border border-[#121212]/10 rounded-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212] font-serif-editorial text-sm mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D5A3F]" />
                <h3>Tamper-Evident Citations</h3>
              </div>
              <p className="text-[#57534E] leading-relaxed">
                Atomic claims are cross-checked against official transcripts with direct line citations (E001, E002) and verified severity flags.
              </p>
            </div>

            <div className="p-3.5 bg-[#FDFCFB] border border-[#121212]/10 rounded-xs">
              <div className="flex items-center gap-2 font-bold text-[#121212] font-serif-editorial text-sm mb-1.5">
                <Scale className="w-4 h-4 text-[#2A4B7C]" />
                <h3>Evidence Adjudication</h3>
              </div>
              <p className="text-[#57534E] leading-relaxed">
                Replaces arithmetic averages with an evidence-grounded adjudication matrix that weighs verified facts over subjective rhetoric.
              </p>
            </div>
          </div>

          {/* Structured Q&A Accordion */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#57534E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D94F33]" />
              Structured System Inquiries & Explanations
            </h3>

            <div className="divide-y divide-[#121212]/10 border border-[#121212]/10 rounded-xs bg-[#FDFCFB]">
              {FAQ_ENTRIES.map((entry) => {
                const isExpanded = expandedFaq === entry.id;
                return (
                  <article key={entry.id} className="p-4 text-xs">
                    <button
                      id={`btn-${entry.id}`}
                      type="button"
                      onClick={() => toggleFaq(entry.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`answer-${entry.id}`}
                      className="w-full text-left flex items-start justify-between gap-3 font-serif-editorial font-bold text-sm text-[#121212] hover:text-[#D94F33] transition-colors cursor-pointer"
                    >
                      <span>{entry.question}</span>
                      <span className="shrink-0 mt-0.5 text-[#57534E]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    {/* Short Answer Snippet for Immediate Parsing */}
                    <p className="text-xs text-[#57534E] mt-1 italic font-serif-editorial">
                      {entry.shortAnswer}
                    </p>

                    {isExpanded && (
                      <div id={`answer-${entry.id}`} className="mt-3 pt-3 border-t border-[#121212]/10 space-y-2">
                        <p className="text-xs text-[#121212] leading-relaxed font-sans">
                          {entry.fullAnswer}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] uppercase font-semibold text-[#57534E]">Index Tags:</span>
                          {entry.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 text-[10px] font-mono bg-[#EFECE7] text-[#121212] rounded-xs border border-[#121212]/10"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Machine-Readable Reference Links */}
          <div className="pt-3 border-t border-[#121212]/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#57534E] font-mono">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#D94F33]" />
              <span>AI Guidance Files:</span>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#121212] underline hover:text-[#D94F33]"
              >
                /llms.txt
              </a>
              <span>•</span>
              <a
                href="/llms-full.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#121212] underline hover:text-[#D94F33]"
              >
                /llms-full.txt
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-[#2D5A3F] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Schema.org JSON-LD & WCAG AA Compliant</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
