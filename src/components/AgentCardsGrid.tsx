import React from 'react';
import {
  ShieldAlert,
  Code2,
  Users2,
  Briefcase,
  AlertOctagon,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Award
} from 'lucide-react';
import { AgentAssessment, AgentType, EvidenceItem, PositionRevisionRecord } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface AgentCardsGridProps {
  assessments: Record<AgentType, AgentAssessment>;
  positionRevisions?: PositionRevisionRecord[];
  evidenceStore: EvidenceItem[];
  onSelectEvidence: (id: string) => void;
}

export const AgentCardsGrid: React.FC<AgentCardsGridProps> = ({
  assessments,
  positionRevisions = [],
  evidenceStore,
  onSelectEvidence,
}) => {
  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'STRONG_YES':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#2D5A3F] text-white">STRONG YES</span>;
      case 'YES':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#2D5A3F]/90 text-white">YES</span>;
      case 'MAYBE':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#C2781D] text-white">MAYBE</span>;
      case 'NO':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#A82A2A]/90 text-white">NO</span>;
      case 'STRONG_NO':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#A82A2A] text-white">STRONG NO</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] rounded-xs bg-[#121212] text-white">{rec}</span>;
    }
  };

  const getPersonaMeta = (type: AgentType) => {
    switch (type) {
      case 'technical':
        return {
          icon: <Code2 className="w-5 h-5 text-[#2D5A3F]" />,
          iconBg: 'bg-[#E9F2EC]',
          headerBg: 'bg-[#FDFCFB]',
          accentColor: 'text-[#2D5A3F]',
          roleBadge: 'Technical Architecture & Rigor',
        };
      case 'hr':
        return {
          icon: <Users2 className="w-5 h-5 text-[#C2781D]" />,
          iconBg: 'bg-[#FAF0E6]',
          headerBg: 'bg-[#FDFCFB]',
          accentColor: 'text-[#C2781D]',
          roleBadge: 'Culture, Teamwork & Growth',
        };
      case 'hiring_manager':
        return {
          icon: <Briefcase className="w-5 h-5 text-[#D94F33]" />,
          iconBg: 'bg-[#FDF0EE]',
          headerBg: 'bg-[#FDFCFB]',
          accentColor: 'text-[#D94F33]',
          roleBadge: 'Role Fit & Business Impact',
        };
      case 'skeptic':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-[#A82A2A]" />,
          iconBg: 'bg-[#FDF0EE]',
          headerBg: 'bg-[#FDFCFB]',
          accentColor: 'text-[#A82A2A]',
          roleBadge: 'Auditor & Risk Challenger',
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-[#121212]" />,
          iconBg: 'bg-[#F4F1EA]',
          headerBg: 'bg-[#FDFCFB]',
          accentColor: 'text-[#121212]',
          roleBadge: 'Panel Member',
        };
    }
  };

  const agentOrder: AgentType[] = ['technical', 'hr', 'hiring_manager', 'skeptic'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Isolation Guarantee Banner */}
      <div className="p-4 sm:p-5 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 flex items-start gap-3.5 text-xs text-[#121212] shadow-2xs">
        <div className="p-2 rounded-xs bg-[#E9F2EC] text-[#2D5A3F] border border-[#B4D5C2] shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#121212]">
            <span className="font-serif-editorial text-sm">Isolated Evaluation Protocol & Memory Firewall</span>
            <span className="px-2 py-0.5 bg-[#E9F2EC] text-[#2D5A3F] border border-[#B4D5C2] text-[10px] font-bold uppercase tracking-wider rounded-xs">
              Zero Contamination
            </span>
          </div>
          <p className="text-[#57534E] leading-relaxed font-serif-editorial italic text-xs">
            Each persona operates in strict algorithmic isolation during initial appraisal, independently citing primary evidence prior to the multi-turn adversarial debate arena.
          </p>
        </div>
      </div>

      {/* 4 Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agentOrder.map((agentType) => {
          const assessment = assessments[agentType];
          if (!assessment) return null;

          const meta = getPersonaMeta(agentType);
          const revision = positionRevisions.find((r) => r.agentType === agentType);

          return (
            <div
              key={agentType}
              id={`agent-card-${agentType}`}
              className="rounded-xs bg-[#FFFFFF] border border-[#121212]/15 shadow-2xs transition-all flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div className={`p-4 sm:p-5 border-b border-[#121212]/10 ${meta.headerBg} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xs ${meta.iconBg} border border-[#121212]/10 shadow-2xs`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-base text-[#121212] tracking-tight">
                      {assessment.agentName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${meta.accentColor}`}>
                        {assessment.personaTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {getRecommendationBadge(assessment.recommendation)}
                  <div className="text-[11px] font-mono text-[#57534E] mt-1.5">
                    Confidence: <span className="font-bold text-[#121212]">{assessment.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Position Revision Delta Banner (if updated after debate) */}
              {revision && revision.changed && (
                <div className="px-4 py-2 bg-[#FAF0E6] border-b border-[#E5CFB8] flex items-center justify-between text-xs text-[#8C510A]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Award className="w-3.5 h-3.5 text-[#C2781D]" />
                    <span className="font-serif-editorial">Calibrated During Debate:</span>
                    <span className="font-mono text-[#57534E] line-through">{revision.initialConfidence}%</span>
                    <ArrowRight className="w-3 h-3 text-[#C2781D]" />
                    <span className="font-mono font-bold text-[#8C510A]">{revision.postDebateConfidence}%</span>
                  </span>
                  <span className="text-[11px] text-[#57534E] italic truncate max-w-[200px]" title={revision.reason}>
                    {revision.reason}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 text-xs">
                {/* Reasoning summary */}
                <div className="p-3.5 rounded-xs bg-[#FDFCFB] border border-[#121212]/10">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#57534E] font-bold block mb-1.5">
                    Independent Synthesis
                  </span>
                  <p className="text-[#292524] leading-relaxed font-serif-editorial text-[13px]">
                    {assessment.keyReasoning}
                  </p>
                </div>

                {/* Evidence-Backed Strengths */}
                <div>
                  <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#2D5A3F] flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Evidence-Backed Strengths ({assessment.strengths.length})</span>
                  </span>
                  <div className="space-y-1.5">
                    {assessment.strengths.length === 0 ? (
                      <p className="text-[#78716C] italic font-serif-editorial">No primary strengths cited.</p>
                    ) : (
                      assessment.strengths.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xs bg-[#E9F2EC]/50 border border-[#B4D5C2]/60 flex items-start justify-between gap-2"
                        >
                          <span className="text-[#121212] leading-tight font-medium">{st.statement}</span>
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {st.evidenceIds.map((eid) => (
                              <EvidenceBadge
                                key={eid}
                                id={eid}
                                evidenceStore={evidenceStore}
                                onSelectEvidence={onSelectEvidence}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Evidence-Backed Concerns */}
                <div>
                  <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#A82A2A] flex items-center gap-1 mb-2">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Identified Risks & Flagged Evidence ({assessment.concerns.length})</span>
                  </span>
                  <div className="space-y-1.5">
                    {assessment.concerns.length === 0 ? (
                      <p className="text-[#78716C] italic font-serif-editorial">No significant concerns raised.</p>
                    ) : (
                      assessment.concerns.map((cn, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] flex items-start justify-between gap-2"
                        >
                          <span className="text-[#121212] leading-tight font-medium">{cn.statement}</span>
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {cn.evidenceIds.map((eid) => (
                              <EvidenceBadge
                                key={eid}
                                id={eid}
                                evidenceStore={evidenceStore}
                                onSelectEvidence={onSelectEvidence}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Initial Debate Challenge Question */}
                {assessment.debateQuestions && assessment.debateQuestions.length > 0 && (
                  <div className="p-3 rounded-xs bg-[#F4F1EA] border border-[#121212]/10 text-xs">
                    <span className="text-[#D94F33] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Proposed Debate Challenge:</span>
                    </span>
                    <p className="text-[#121212] font-serif-editorial italic text-xs leading-relaxed">
                      "{assessment.debateQuestions[0]}"
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Evidence Citations Footer */}
              <div className="p-3 bg-[#FDFCFB] border-t border-[#121212]/10 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#57534E]">
                  Citations:
                </span>
                <div className="flex flex-wrap gap-1">
                  {assessment.citedEvidenceIds.map((eid) => (
                    <EvidenceBadge
                      key={eid}
                      id={eid}
                      evidenceStore={evidenceStore}
                      onSelectEvidence={onSelectEvidence}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

