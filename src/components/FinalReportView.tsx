import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Download,
  Award,
  Scale,
  BrainCircuit,
  FileCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import {
  FinalDecision,
  EvidenceItem,
  CandidateProfile,
  JobDescription,
  RecommendationType,
  AgentAssessment,
  AgentType
} from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface FinalReportViewProps {
  decision: FinalDecision;
  profile: CandidateProfile;
  jobDescription: JobDescription;
  assessments?: Record<AgentType, AgentAssessment>;
  evidenceStore: EvidenceItem[];
  onSelectEvidence: (id: string) => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  decision,
  profile,
  jobDescription,
  assessments,
  evidenceStore,
  onSelectEvidence,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const getRecommendationStyle = (rec: RecommendationType) => {
    switch (rec) {
      case 'STRONG_HIRE':
        return {
          banner: 'bg-[#E9F2EC] border-[#2D5A3F]/40 text-[#1C3D2B]',
          badge: 'bg-[#2D5A3F] text-white',
          title: 'Strong Hire Recommendation',
          subtitle: 'Candidate rigorously satisfies and exceeds core engineering, architectural, and cultural criteria with verifiable primary evidence.',
          accent: 'text-[#2D5A3F]',
        };
      case 'HIRE':
        return {
          banner: 'bg-[#E9F2EC]/80 border-[#2D5A3F]/30 text-[#1C3D2B]',
          badge: 'bg-[#2D5A3F] text-white',
          title: 'Hire Recommendation',
          subtitle: 'Candidate presents solid evidence meeting core role requirements with satisfactory risk mitigation.',
          accent: 'text-[#2D5A3F]',
        };
      case 'INTERVIEW':
        return {
          banner: 'bg-[#F4F1EA] border-[#121212]/20 text-[#121212]',
          badge: 'bg-[#121212] text-white',
          title: 'Advance to Targeted Interview',
          subtitle: 'Strong practical baseline identified; targeted live probe required to verify flagged discrepancies.',
          accent: 'text-[#D94F33]',
        };
      case 'MAYBE':
        return {
          banner: 'bg-[#FAF0E6] border-[#E5CFB8] text-[#8C510A]',
          badge: 'bg-[#C2781D] text-white',
          title: 'Borderline / Conditional Evaluation',
          subtitle: 'Equally balanced strengths and unproven assumptions requiring strict committee scrutiny.',
          accent: 'text-[#C2781D]',
        };
      case 'NO_HIRE':
        return {
          banner: 'bg-[#FDF0EE] border-[#F0C4BD] text-[#A82A2A]',
          badge: 'bg-[#A82A2A] text-white',
          title: 'Do Not Hire Recommendation',
          subtitle: 'Critical requirement gaps or unresolvable resume-transcript discrepancies identified.',
          accent: 'text-[#A82A2A]',
        };
      default:
        return {
          banner: 'bg-[#FFFFFF] border-[#121212]/15 text-[#121212]',
          badge: 'bg-[#121212] text-white',
          title: rec,
          subtitle: 'Adjudication completed.',
          accent: 'text-[#121212]',
        };
    }
  };

  const recStyle = getRecommendationStyle(decision.recommendation);

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(18);
      doc.setTextColor(18, 18, 18);
      doc.text("AI HIRING PANEL — OFFICIAL ADJUDICATION DOSSIER", 14, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(87, 83, 78);
      doc.text(`Candidate: ${profile.name} | Target Role: ${jobDescription.title}`, 14, y);
      y += 6;
      doc.text(`Final Recommendation: ${decision.recommendation} (Confidence: ${decision.confidence}%)`, 14, y);
      y += 10;

      doc.setDrawColor(18, 18, 18);
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFontSize(13);
      doc.setTextColor(18, 18, 18);
      doc.text("Executive Summary", 14, y);
      y += 6;

      doc.setFontSize(9.5);
      doc.setTextColor(41, 37, 36);
      const splitExec = doc.splitTextToSize(decision.executiveSummary, 180);
      doc.text(splitExec, 14, y);
      y += splitExec.length * 5 + 6;

      doc.setFontSize(13);
      doc.setTextColor(18, 18, 18);
      doc.text("Evidence-Weighted Reasoning (Non-Averaging)", 14, y);
      y += 6;

      doc.setFontSize(9.5);
      doc.setTextColor(41, 37, 36);
      const splitReasoning = doc.splitTextToSize(decision.evidenceWeightedReasoning, 180);
      doc.text(splitReasoning, 14, y);
      y += splitReasoning.length * 5 + 8;

      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(13);
      doc.setTextColor(18, 18, 18);
      doc.text("Key Strengths & Identified Risks", 14, y);
      y += 6;

      decision.strengths.forEach((st) => {
        doc.setFontSize(9.5);
        doc.setTextColor(45, 90, 63);
        doc.text(`[STRENGTH] ${st.statement} (Evidence: ${st.evidenceIds.join(', ') || 'N/A'})`, 14, y);
        y += 6;
      });

      decision.concerns.forEach((cn) => {
        doc.setFontSize(9.5);
        doc.setTextColor(168, 42, 42);
        doc.text(`[CONCERN] ${cn.statement} (Evidence: ${cn.evidenceIds.join(', ') || 'N/A'})`, 14, y);
        y += 6;
      });

      y += 6;
      if (decision.interviewQuestions && decision.interviewQuestions.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(13);
        doc.setTextColor(18, 18, 18);
        doc.text("Targeted Interview Probes", 14, y);
        y += 6;

        decision.interviewQuestions.forEach((q) => {
          doc.setFontSize(9.5);
          doc.setTextColor(41, 37, 36);
          const qText = doc.splitTextToSize(`• [${q.targetArea}] ${q.question}`, 180);
          doc.text(qText, 14, y);
          y += qText.length * 5 + 3;
        });
      }

      doc.save(`Hiring_Dossier_${profile.name.replace(/\s+/g, '_')}.pdf`);

      if (decision.recommendation === 'STRONG_HIRE' || decision.recommendation === 'HIRE') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Final Recommendation Card */}
      <div className={`p-6 sm:p-7 rounded-xs border ${recStyle.banner} shadow-2xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] rounded-xs ${recStyle.badge}`}>
              Official Verdict
            </span>
            <span className="text-[11px] text-[#57534E] flex items-center gap-1 font-mono">
              <Scale className="w-3.5 h-3.5 text-[#D94F33]" />
              Evidence-Weighted Non-Averaging Synthesis
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#121212] tracking-tight">
            {recStyle.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl leading-relaxed font-serif-editorial italic">
            {recStyle.subtitle}
          </p>
        </div>

        {/* Confidence & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          <div className="text-left sm:text-right sm:border-r border-[#121212]/15 sm:pr-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#57534E] block font-bold">
              Adjudication Confidence
            </span>
            <div className="text-3xl font-black text-[#121212] font-mono flex items-baseline gap-1">
              <span>{decision.confidence}%</span>
            </div>
            <span className="text-[10px] text-[#57534E] font-serif-editorial italic">Calibrated Post-Debate</span>
          </div>

          <button
            id="btn-export-pdf-dossier"
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#121212] hover:bg-[#2A2A2A] text-[#FDFCFB] rounded-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#FDFCFB]" />
            <span>{isExportingPDF ? 'Generating...' : 'Download PDF Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Non-Averaging Synthesis & Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Executive Summary */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <BrainCircuit className="w-4 h-4 text-[#D94F33]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212]">
              Executive Adjudication Summary
            </h3>
          </div>
          <p className="text-xs text-[#292524] leading-relaxed bg-[#FDFCFB] p-4 rounded-xs border border-[#121212]/10 font-serif-editorial text-[13px]">
            {decision.executiveSummary}
          </p>
        </div>

        {/* Evidence Weighted Reasoning */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <Scale className="w-4 h-4 text-[#C2781D]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212]">
              Evidence-Weighted Reasoning
            </h3>
          </div>
          <p className="text-xs text-[#292524] leading-relaxed bg-[#FDFCFB] p-4 rounded-xs border border-[#121212]/10 font-serif-editorial text-[13px]">
            {decision.evidenceWeightedReasoning}
          </p>
        </div>
      </div>

      {/* Strengths & Concerns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D5A3F] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evidence-Backed Strengths ({decision.strengths.length})</span>
            </span>
          </div>

          <div className="space-y-2">
            {(decision.strengths || []).map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xs bg-[#E9F2EC]/50 border border-[#B4D5C2]/60 flex items-start justify-between gap-3 text-xs"
              >
                <span className="text-[#121212] leading-relaxed font-medium">{st.statement}</span>
                <div className="flex flex-wrap gap-1 shrink-0">
                  {(st.evidenceIds || []).map((eid) => (
                    <EvidenceBadge
                      key={eid}
                      id={eid}
                      evidenceStore={evidenceStore}
                      onSelectEvidence={onSelectEvidence}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concerns */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#A82A2A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Concerns & Flagged Risks ({(decision.concerns || []).length})</span>
            </span>
          </div>

          <div className="space-y-2">
            {(decision.concerns || []).map((cn, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] flex items-start justify-between gap-3 text-xs"
              >
                <span className="text-[#121212] leading-relaxed font-medium">{cn.statement}</span>
                <div className="flex flex-wrap gap-1 shrink-0">
                  {(cn.evidenceIds || []).map((eid) => (
                    <EvidenceBadge
                      key={eid}
                      id={eid}
                      evidenceStore={evidenceStore}
                      onSelectEvidence={onSelectEvidence}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disagreements Resolution Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Resolved Disagreements */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <ShieldCheck className="w-4 h-4 text-[#2D5A3F]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212]">
              Resolved Committee Disagreements
            </span>
          </div>

          <div className="space-y-3">
            {(decision.resolvedDisagreements || []).map((res, idx) => (
              <div key={idx} className="p-3.5 rounded-xs bg-[#F4F1EA] border border-[#121212]/10 text-xs space-y-1.5">
                <div className="font-bold text-[#121212] font-serif-editorial text-sm">{res.disputeTopic}</div>
                <p className="text-[#57534E] text-xs leading-relaxed">{res.resolution}</p>
                <div className="text-[11px] text-[#2D5A3F] font-semibold pt-1 border-t border-[#121212]/10">
                  Prevailing argument: {res.prevailingArgument}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unresolved Disagreements & Risks */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <HelpCircle className="w-4 h-4 text-[#C2781D]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212]">
              Unresolved Questions & Interview Probes
            </span>
          </div>

          <div className="space-y-3">
            {(decision.unresolvedDisagreements || []).map((unres, idx) => (
              <div key={idx} className="p-3.5 rounded-xs bg-[#FAF0E6] border border-[#E5CFB8] text-xs space-y-1.5">
                <div className="font-bold text-[#8C510A] font-serif-editorial text-sm">{unres.disputeTopic}</div>
                <p className="text-[#57534E] text-xs leading-relaxed">{unres.whyUnresolved}</p>
                <div className="text-[11px] text-[#C2781D] font-semibold pt-1 border-t border-[#E5CFB8]/60">
                  Suggested probe: {unres.suggestedInterviewProbe}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Interview Probes Mapped to Evidence */}
      {decision.interviewQuestions && decision.interviewQuestions.length > 0 && (
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D94F33]" />
              <span>Recommended Target Interview Probes ({decision.interviewQuestions.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {decision.interviewQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#EFECE7] text-[#121212] border border-[#121212]/15">
                    {q.targetArea}
                  </span>
                  {q.relatedEvidenceId && (
                    <EvidenceBadge
                      id={q.relatedEvidenceId}
                      evidenceStore={evidenceStore}
                      onSelectEvidence={onSelectEvidence}
                    />
                  )}
                </div>
                <p className="text-[#121212] font-serif-editorial text-sm leading-relaxed font-bold">
                  "{q.question}"
                </p>
                <p className="text-[#57534E] text-xs italic">
                  Why needed: {q.whyNeeded}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

