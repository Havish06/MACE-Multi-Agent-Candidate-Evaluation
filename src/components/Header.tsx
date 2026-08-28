import React from 'react';
import {
  Users,
  Shield,
  MessageSquareQuote,
  Layers,
  FileCheck,
  Upload,
  Play,
  RotateCw,
  Sparkles,
  Scale
} from 'lucide-react';
import { BenchmarkCandidate } from '../data/sampleCandidates';

export type ActiveTab = 'dossier' | 'personas' | 'debate' | 'evidence' | 'profile';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  benchmarkCandidates: BenchmarkCandidate[];
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
  onOpenUploadModal: () => void;
  onRunFullPipeline: () => void;
  isProcessing: boolean;
  pipelineStatus: string;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  benchmarkCandidates,
  selectedCandidateId,
  onSelectCandidate,
  onOpenUploadModal,
  onRunFullPipeline,
  isProcessing,
  pipelineStatus,
  hasGeminiKey,
}) => {
  return (
    <header id="app-header" className="border-b border-[#121212]/15 bg-[#FDFCFB] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Masthead bar: Identity + Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4 border-b border-[#121212]/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xs bg-[#121212] text-[#FDFCFB] flex items-center justify-center font-serif-editorial text-xl font-black shadow-xs">
              <span>№</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif-editorial font-bold text-[#121212] tracking-tight">
                  AI Hiring Panel
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] bg-[#EFECE7] text-[#121212] border border-[#121212]/15 rounded-xs">
                  Adjudication Dossier
                </span>
                {isProcessing && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#C2781D] border border-[#E5CFB8] rounded-xs animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    {pipelineStatus || 'Evaluating...'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#57534E] font-serif-editorial italic mt-0.5">
                Isolated 4-Persona Deliberation • Evidence-Weighted Adjudication Engine
              </p>
            </div>
          </div>

          {/* Right controls: Candidate selector + Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {/* Benchmark Candidate Quick Selector */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#121212]/20 rounded-xs px-3 py-1.5 text-xs text-[#121212] shadow-2xs">
              <span className="text-[#57534E] text-[11px] uppercase tracking-wider font-bold">Candidate:</span>
              <select
                id="select-benchmark-candidate"
                value={selectedCandidateId}
                onChange={(e) => onSelectCandidate(e.target.value)}
                disabled={isProcessing}
                className="bg-transparent text-[#121212] font-semibold focus:outline-hidden cursor-pointer"
              >
                {benchmarkCandidates.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#FFFFFF] text-[#121212]">
                    {c.name} — {c.targetRole}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Upload Button */}
            <button
              id="btn-upload-candidate"
              type="button"
              onClick={onOpenUploadModal}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/25 rounded-xs transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#57534E]" />
              <span>Upload Custom</span>
            </button>

            {/* Run Full Multi-Agent Evaluation */}
            <button
              id="btn-run-full-pipeline"
              type="button"
              onClick={onRunFullPipeline}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#D94F33] hover:bg-[#B83A20] text-white rounded-xs transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deliberating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Agent Debate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          role="tablist"
          aria-label="Evaluation Navigation"
          className="flex space-x-1 sm:space-x-4 pt-1 overflow-x-auto no-scrollbar"
        >
          <button
            id="nav-tab-dossier"
            type="button"
            role="tab"
            aria-selected={activeTab === 'dossier'}
            aria-controls="tabpanel-dossier"
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33] ${
              activeTab === 'dossier'
                ? 'border-[#D94F33] text-[#121212] bg-[#F4F1EA]/60 font-black'
                : 'border-transparent text-[#57534E] hover:text-[#121212] hover:bg-[#F4F1EA]/40'
            }`}
          >
            <Scale className="w-4 h-4 text-[#D94F33]" aria-hidden="true" />
            <span>Adjudication Dossier</span>
          </button>

          <button
            id="nav-tab-personas"
            type="button"
            role="tab"
            aria-selected={activeTab === 'personas'}
            aria-controls="tabpanel-personas"
            onClick={() => setActiveTab('personas')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33] ${
              activeTab === 'personas'
                ? 'border-[#D94F33] text-[#121212] bg-[#F4F1EA]/60 font-black'
                : 'border-transparent text-[#57534E] hover:text-[#121212] hover:bg-[#F4F1EA]/40'
            }`}
          >
            <Users className="w-4 h-4 text-[#2D5A3F]" aria-hidden="true" />
            <span>Independent 4-Agent Panel</span>
          </button>

          <button
            id="nav-tab-debate"
            type="button"
            role="tab"
            aria-selected={activeTab === 'debate'}
            aria-controls="tabpanel-debate"
            onClick={() => setActiveTab('debate')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33] ${
              activeTab === 'debate'
                ? 'border-[#D94F33] text-[#121212] bg-[#F4F1EA]/60 font-black'
                : 'border-transparent text-[#57534E] hover:text-[#121212] hover:bg-[#F4F1EA]/40'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4 text-[#C2781D]" aria-hidden="true" />
            <span>Live Debate Arena & Voice</span>
          </button>

          <button
            id="nav-tab-evidence"
            type="button"
            role="tab"
            aria-selected={activeTab === 'evidence'}
            aria-controls="tabpanel-evidence"
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33] ${
              activeTab === 'evidence'
                ? 'border-[#D94F33] text-[#121212] bg-[#F4F1EA]/60 font-black'
                : 'border-transparent text-[#57534E] hover:text-[#121212] hover:bg-[#F4F1EA]/40'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#121212]" aria-hidden="true" />
            <span>Evidence Store & Contradictions</span>
          </button>

          <button
            id="nav-tab-profile"
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            aria-controls="tabpanel-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33] ${
              activeTab === 'profile'
                ? 'border-[#D94F33] text-[#121212] bg-[#F4F1EA]/60 font-black'
                : 'border-transparent text-[#57534E] hover:text-[#121212] hover:bg-[#F4F1EA]/40'
            }`}
          >
            <Layers className="w-4 h-4 text-[#57534E]" aria-hidden="true" />
            <span>Candidate Profile & Transcript</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

