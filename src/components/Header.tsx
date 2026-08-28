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
  Scale,
  LogOut,
  Keyboard
} from 'lucide-react';
import { BenchmarkCandidate } from '../data/sampleCandidates';
import { useAuth } from '../lib/AuthContext';

export type ActiveTab = 'dossier' | 'personas' | 'debate' | 'evidence' | 'profile';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  benchmarkCandidates: BenchmarkCandidate[];
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
  onOpenUploadModal: () => void;
  onOpenAuthModal?: () => void;
  onOpenShortcutsModal?: () => void;
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
  onOpenAuthModal,
  onOpenShortcutsModal,
  onRunFullPipeline,
  isProcessing,
  pipelineStatus,
  hasGeminiKey: _hasGeminiKey,
}) => {
  const { user, signOut } = useAuth();
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
                  MACE
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] bg-[#EFECE7] text-[#121212] border border-[#121212]/15 rounded-xs">
                  Adjudication Dossier
                </span>
                {isProcessing && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#C2781D] border border-[#E5CFB8] rounded-xs animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" aria-hidden="true" />
                    {pipelineStatus || 'Evaluating...'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#57534E] font-serif-editorial italic mt-0.5">
                Multi-Agent Committee Evaluator • Isolated 4-Persona Deliberation & Adjudication Engine
              </p>
            </div>
          </div>

          {/* Right controls: Candidate selector + Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {/* Benchmark Candidate Quick Selector */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#121212]/20 rounded-xs px-3 py-1.5 text-xs text-[#121212] shadow-2xs">
              <label htmlFor="select-benchmark-candidate" className="text-[#57534E] text-[11px] uppercase tracking-wider font-bold">
                Candidate:
              </label>
              <select
                id="select-benchmark-candidate"
                name="benchmarkCandidate"
                aria-label="Select benchmark candidate"
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
              aria-label="Upload custom resume and transcript"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/25 rounded-xs transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#D94F33]"
            >
              <Upload className="w-3.5 h-3.5 text-[#57534E]" aria-hidden="true" />
              <span>Upload Custom</span>
            </button>

            {/* Keyboard shortcuts trigger */}
            {onOpenShortcutsModal && (
              <button
                id="btn-open-shortcuts"
                type="button"
                onClick={onOpenShortcutsModal}
                title="Keyboard Shortcuts (?)"
                aria-label="Open Keyboard Shortcuts Dialog"
                className="p-2 rounded-xs bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#57534E] hover:text-[#121212] border border-[#121212]/20 transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#D94F33]"
              >
                <Keyboard className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            {/* Firebase Auth Status & Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#121212]/20 rounded-xs px-2.5 py-1.5 text-xs text-[#121212] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#2D5A3F]/15 text-[#2D5A3F] flex items-center justify-center font-bold text-[10px]">
                  {user.isAnonymous ? 'G' : (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="font-semibold max-w-[100px] truncate text-[11px]">
                  {user.isAnonymous ? 'Guest Evaluator' : (user.displayName || user.email?.split('@')[0])}
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out of evaluation session"
                  aria-label="Sign out"
                  className="text-[#57534E] hover:text-[#D94F33] p-0.5 rounded-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                id="btn-open-auth-modal"
                type="button"
                onClick={onOpenAuthModal}
                aria-label="Sign in with Google or as guest evaluator"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#FAF0E6] hover:bg-[#F3E5D4] text-[#8C510A] border border-[#E5CFB8] rounded-xs transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#D94F33]"
              >
                <Shield className="w-3.5 h-3.5 text-[#8C510A]" aria-hidden="true" />
                <span>Sign In</span>
              </button>
            )}

            {/* Run Full Multi-Agent Evaluation */}
            <button
              id="btn-run-full-pipeline"
              type="button"
              onClick={onRunFullPipeline}
              disabled={isProcessing}
              aria-label={isProcessing ? 'Deliberating candidate evaluation...' : 'Run Agent Debate'}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#D94F33] hover:bg-[#B83A20] text-white rounded-xs transition-all cursor-pointer disabled:opacity-50 shadow-xs focus-visible:ring-2 focus-visible:ring-[#D94F33]"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Deliberating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Run Agent Debate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          role="tablist"
          aria-label="Evaluation Navigation Tabs"
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
