import React from 'react';
import { FileText } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceBadgeProps {
  id: string;
  evidenceStore?: EvidenceItem[];
  onSelectEvidence?: (evidenceId: string) => void;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  id,
  evidenceStore,
  onSelectEvidence,
  className = '',
}) => {
  const item = evidenceStore?.find((e) => e.id.toUpperCase() === id.toUpperCase());

  return (
    <button
      id={`evidence-badge-${id}`}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectEvidence) onSelectEvidence(id);
      }}
      title={item ? `${item.source} (${item.pageOrSection}): "${item.text.slice(0, 100)}..."` : `Evidence ID: ${id}`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-mono font-medium rounded-xs bg-[#EFECE7] hover:bg-[#E2DDD5] text-[#121212] hover:text-[#D94F33] border border-[#121212]/20 hover:border-[#D94F33]/50 transition-colors cursor-pointer ${className}`}
    >
      <FileText className="w-3 h-3 text-[#D94F33] shrink-0" />
      <span className="tracking-tight">{id}</span>
    </button>
  );
};

