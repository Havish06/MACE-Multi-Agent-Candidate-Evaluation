import React, { useState } from 'react';
import {
  Search,
  FileCheck,
  AlertTriangle,
  Bookmark,
  GraduationCap,
  Briefcase,
  Code2
} from 'lucide-react';
import { EvidenceItem, ContradictionItem } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface EvidenceExplorerProps {
  evidenceStore: EvidenceItem[];
  contradictions: ContradictionItem[];
  onSelectEvidence: (id: string) => void;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  evidenceStore,
  contradictions,
  onSelectEvidence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredEvidence = evidenceStore.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.pageOrSection.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'resume') return e.source.includes('resume');
    if (selectedFilter === 'transcript') return e.source.includes('transcript');
    if (selectedFilter === 'grades') return e.type === 'grade' || e.type === 'education_fact';
    if (selectedFilter === 'projects') return e.type === 'project' || e.type === 'technical_claim';

    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grade':
      case 'education_fact':
        return <GraduationCap className="w-3.5 h-3.5 text-[#2D5A3F]" />;
      case 'project':
      case 'technical_claim':
        return <Code2 className="w-3.5 h-3.5 text-[#D94F33]" />;
      case 'experience':
      case 'behavioral':
        return <Briefcase className="w-3.5 h-3.5 text-[#C2781D]" />;
      default:
        return <FileCheck className="w-3.5 h-3.5 text-[#121212]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Contradictions & Discrepancy Analyzer */}
      {contradictions && contradictions.length > 0 && (
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#A82A2A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#A82A2A]" />
              <span>Flagged Contradictions & Resume-Transcript Discrepancies ({contradictions.length})</span>
            </span>
            <span className="text-xs text-[#57534E] font-serif-editorial italic">Cross-Document Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contradictions.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] flex flex-col justify-between text-xs space-y-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#A82A2A] bg-[#FFFFFF] px-1.5 py-0.5 rounded-xs border border-[#F0C4BD]">{c.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs bg-[#A82A2A] text-white">
                      {c.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                  <h4 className="font-serif-editorial font-bold text-sm text-[#121212]">{c.topic}</h4>
                  <p className="text-[#57534E] text-xs mt-1 leading-relaxed font-serif-editorial italic">{c.explanation}</p>
                </div>

                <div className="p-3 rounded-xs bg-[#FFFFFF] border border-[#F0C4BD] space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider shrink-0">Resume Claim:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-[#121212] text-[11px] text-right">{c.resumeClaim}</span>
                      {c.resumeEvidenceId && (
                        <EvidenceBadge
                          id={c.resumeEvidenceId}
                          evidenceStore={evidenceStore}
                          onSelectEvidence={onSelectEvidence}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#121212]/10 gap-2">
                    <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider shrink-0">Transcript Fact:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-[#2D5A3F] text-[11px] text-right">{c.transcriptFact}</span>
                      {c.transcriptEvidenceId && (
                        <EvidenceBadge
                          id={c.transcriptEvidenceId}
                          evidenceStore={evidenceStore}
                          onSelectEvidence={onSelectEvidence}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Store Browser */}
      <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#121212]/10">
          <div>
            <h3 className="text-xs font-bold text-[#121212] uppercase tracking-[0.16em] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#D94F33]" />
              <span>Evidence Repository Store ({evidenceStore.length} citations)</span>
            </h3>
            <p className="text-xs text-[#57534E] font-serif-editorial italic mt-0.5">
              Verified ground-truth snippets extracted from candidate primary documents
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#57534E] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search evidence or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FDFCFB] border border-[#121212]/20 rounded-xs pl-9 pr-3 py-1.5 text-xs text-[#121212] placeholder-[#57534E] focus:outline-hidden focus:border-[#121212]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#57534E] mr-1">Filter By:</span>
          {[
            { key: 'all', label: 'All Evidence' },
            { key: 'resume', label: 'Resume Only' },
            { key: 'transcript', label: 'Transcript Records' },
            { key: 'grades', label: 'Grades & Academics' },
            { key: 'projects', label: 'Projects & Tech Claims' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelectedFilter(f.key)}
              className={`px-3 py-1 text-xs font-serif-editorial font-medium rounded-xs transition-colors cursor-pointer ${
                selectedFilter === f.key
                  ? 'bg-[#121212] text-[#FDFCFB] font-bold'
                  : 'bg-[#FDFCFB] text-[#57534E] hover:text-[#121212] border border-[#121212]/15'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Evidence Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredEvidence.map((e) => (
            <div
              key={e.id}
              onClick={() => onSelectEvidence(e.id)}
              className="p-4 rounded-xs bg-[#FDFCFB] hover:bg-[#FAF0E6]/30 border border-[#121212]/15 hover:border-[#D94F33] transition-all cursor-pointer flex flex-col justify-between gap-2.5 text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#121212] bg-[#EFECE7] px-2 py-0.5 rounded-xs border border-[#121212]/15">
                      {e.id}
                    </span>
                    <span className="text-[11px] text-[#57534E] font-medium capitalize flex items-center gap-1">
                      {getTypeIcon(e.type)}
                      {e.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#57534E] font-mono">
                    {Math.round((e.confidence ?? 1) * 100)}% Conf
                  </span>
                </div>

                <p className="text-[#121212] font-mono text-xs leading-relaxed bg-[#FFFFFF] p-3 rounded-xs border border-[#121212]/10">
                  "{e.text}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#57534E] pt-2 border-t border-[#121212]/10">
                <span className="flex items-center gap-1 text-[#121212] font-medium">
                  <Bookmark className="w-3 h-3 text-[#D94F33]" />
                  {e.source}
                </span>
                <span className="text-[#57534E] font-serif-editorial italic">{e.pageOrSection}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

