import React from 'react';
import { X, FileText, AlertTriangle, Bookmark } from 'lucide-react';
import { EvidenceItem, ContradictionItem } from '../types';

interface EvidenceModalProps {
  evidenceId: string | null;
  evidenceStore: EvidenceItem[];
  contradictions?: ContradictionItem[];
  onClose: () => void;
  onSelectEvidence?: (id: string) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  evidenceId,
  evidenceStore,
  contradictions = [],
  onClose,
  onSelectEvidence,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (evidenceId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evidenceId, onClose]);

  if (!evidenceId) return null;

  const item = evidenceStore.find(
    (e) => e.id.toUpperCase() === evidenceId.toUpperCase()
  );

  const relatedContradiction = contradictions.find(
    (c) =>
      c.resumeEvidenceId?.toUpperCase() === evidenceId.toUpperCase() ||
      c.transcriptEvidenceId?.toUpperCase() === evidenceId.toUpperCase()
  );

  return (
    <div
      id="evidence-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="evidence-modal-card"
        className="w-full max-w-xl bg-[#FFFFFF] border border-[#121212]/20 rounded-lg shadow-2xl overflow-hidden p-6 sm:p-7 relative text-[#121212]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-evidence-modal"
          type="button"
          aria-label="Close evidence citation modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#121212]/50 hover:text-[#121212] p-1.5 rounded hover:bg-[#F4F1EA] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33]"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#121212]/10">
          <div className="p-2.5 rounded bg-[#F4F1EA] border border-[#121212]/10 text-[#D94F33]" aria-hidden="true">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#121212] bg-[#EFECE7] px-2 py-0.5 rounded-xs border border-[#121212]/15">
                {evidenceId}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#57534E] font-bold">
                {item?.type?.replace('_', ' ') || 'Document Record'}
              </span>
            </div>
            <h3 id="evidence-modal-title" className="text-base font-serif-editorial font-bold text-[#121212] mt-0.5">
              Verified Evidence Record & Citation
            </h3>
          </div>
        </div>

        {item ? (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-[#FDFCFB] border border-[#121212]/15">
              <div className="text-[11px] uppercase tracking-wider text-[#57534E] mb-2 flex items-center justify-between font-semibold">
                <span>Direct Excerpt from Primary Source</span>
                <span className="font-mono text-[10px] text-[#121212]/60">
                  Confidence: {Math.round((item.confidence ?? 1) * 100)}%
                </span>
              </div>
              <p className="text-xs font-mono bg-[#FFFFFF] p-3.5 rounded border border-[#121212]/10 text-[#121212] leading-relaxed italic">
                "{item.text}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-md bg-[#F4F1EA] border border-[#121212]/10">
                <span className="text-[10px] uppercase tracking-wider text-[#57534E] block mb-1 font-semibold">Source Document</span>
                <span className="font-bold text-[#121212] flex items-center gap-1.5 font-serif-editorial text-sm">
                  <Bookmark className="w-3.5 h-3.5 text-[#D94F33]" />
                  {item.source}
                </span>
              </div>
              <div className="p-3 rounded-md bg-[#F4F1EA] border border-[#121212]/10">
                <span className="text-[10px] uppercase tracking-wider text-[#57534E] block mb-1 font-semibold">Section / Index</span>
                <span className="font-medium text-[#121212] font-mono text-xs">
                  {item.pageOrSection || 'Header section'}
                </span>
              </div>
            </div>

            {relatedContradiction && (
              <div className="p-3.5 rounded-md bg-[#FDF0EE] border border-[#F0C4BD] text-xs">
                <div className="flex items-center gap-2 text-[#A82A2A] font-bold mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#D94F33]" />
                  <span className="font-serif-editorial text-sm">Linked Discrepancy: {relatedContradiction.topic}</span>
                </div>
                <p className="text-[#57534E] mb-2 leading-relaxed">{relatedContradiction.explanation}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#F0C4BD]/60">
                  <span className="text-[#57534E] text-[11px] font-semibold uppercase tracking-wider">Resume Claim:</span>
                  <span className="text-[#121212] font-medium">{relatedContradiction.resumeClaim}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[#57534E] text-[11px] font-semibold uppercase tracking-wider">Transcript Fact:</span>
                  <span className="text-[#2D5A3F] font-bold">{relatedContradiction.transcriptFact}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-md bg-[#FAF0E6] border border-[#E5CFB8] text-xs text-[#8C510A]">
            <p className="font-bold font-serif-editorial">Citation Record</p>
            <p className="mt-1">
              Evidence reference ID {evidenceId} was registered during independent evaluation.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#121212]/10 flex justify-end">
          <button
            id="btn-dismiss-evidence-modal"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#121212] hover:bg-[#2A2A2A] text-[#FDFCFB] rounded-xs transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

