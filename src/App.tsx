import React, { useState, useEffect } from 'react';
import {
  Header,
  ActiveTab,
} from './components/Header';
import { AgentCardsGrid } from './components/AgentCardsGrid';
import { DebateRoom } from './components/DebateRoom';
import { FinalReportView } from './components/FinalReportView';
import { EvidenceExplorer } from './components/EvidenceExplorer';
import { CandidateProfileView } from './components/CandidateProfileView';
import { EvidenceModal } from './components/EvidenceModal';
import { UploadModal } from './components/UploadModal';
import { PipelineProgressModal } from './components/PipelineProgressModal';
import { SAMPLE_CANDIDATES, BenchmarkCandidate } from './data/sampleCandidates';
import { DEFAULT_SESSIONS } from './data/defaultSessions';
import {
  CandidateProfile,
  JobDescription,
  EvidenceItem,
  AgentAssessment,
  DisputeTopic,
  DebateMessage,
  PositionRevisionRecord,
  FinalDecision,
  AgentType,
} from './types';
import {
  AlertTriangle,
  Sparkles,
  Bot,
  Users,
  Shield,
  MessageSquareQuote,
  FileCheck,
  Layers,
  ArrowRight,
  RotateCw,
  HelpCircle,
  Play
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dossier');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-alex-rivera');

  // Candidate Data State
  const [profile, setProfile] = useState<CandidateProfile>(SAMPLE_CANDIDATES[0].candidateProfile);
  const [jobDescription, setJobDescription] = useState<JobDescription>(SAMPLE_CANDIDATES[0].jobDescription);
  const [evidenceStore, setEvidenceStore] = useState<EvidenceItem[]>(SAMPLE_CANDIDATES[0].evidenceStore);

  // Agent & Debate State
  const defaultSession = DEFAULT_SESSIONS['cand-alex-rivera'];
  const [assessments, setAssessments] = useState<Record<AgentType, AgentAssessment>>(defaultSession.independentAssessments);
  const [disputes, setDisputes] = useState<DisputeTopic[]>(defaultSession.disputes);
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>(defaultSession.debateMessages);
  const [positionRevisions, setPositionRevisions] = useState<PositionRevisionRecord[]>(defaultSession.finalDecision?.positionRevisions || []);
  const [finalDecision, setFinalDecision] = useState<FinalDecision | null>(defaultSession.finalDecision || null);

  // Modals & UI State
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(1);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [pipelineStatus, setPipelineStatus] = useState('');
  const [hasGeminiKey, setHasGeminiKey] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Health check on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.geminiConfigured));
      })
      .catch((err) => {
        console.warn('Health check warning:', err);
      });
  }, []);

  // Handle benchmark candidate selection
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setErrorMessage(null);

    const found = SAMPLE_CANDIDATES.find((c) => c.id === candidateId);
    if (!found) return;

    setProfile(found.candidateProfile);
    setJobDescription(found.jobDescription);
    setEvidenceStore(found.evidenceStore);

    if (DEFAULT_SESSIONS[candidateId]) {
      const sess = DEFAULT_SESSIONS[candidateId];
      setAssessments(sess.independentAssessments);
      setDisputes(sess.disputes);
      setDebateMessages(sess.debateMessages);
      setPositionRevisions(sess.finalDecision?.positionRevisions || []);
      setFinalDecision(sess.finalDecision || null);
    } else {
      // Trigger full evaluation for this candidate
      runFullPipelineForCandidate(found.resumeRawText, found.transcriptRawText, found.jobDescriptionRawText);
    }
  };

  // Run full pipeline
  const runFullPipelineForCandidate = async (
    resumeText: string,
    transcriptText: string,
    jdText: string
  ) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1 & 2: Ingestion & Evidence Store
      setPipelineStep(1);
      setStepTitle('Document Ingestion & Text Extraction');
      setStepDescription('Parsing candidate resume and official university transcript...');
      setPipelineStatus('Parsing Documents');

      const extractRes = await fetch('/api/candidates/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, transcriptText, jobDescriptionText: jdText }),
      });

      if (!extractRes.ok) {
        const errData = await extractRes.json();
        throw new Error(errData.error || 'Failed to extract candidate profile');
      }

      const extracted = await extractRes.json();
      setProfile(extracted.profile);
      setJobDescription(extracted.jobDescription);
      setEvidenceStore(extracted.evidenceStore);

      // Step 3: Isolated 4-Agent Evaluation
      setPipelineStep(3);
      setStepTitle('Isolated 4-Agent Independent Evaluation');
      setStepDescription('Running Technical, HR, Hiring Manager, and Skeptic personas in parallel sandboxes...');
      setPipelineStatus('Evaluating Personas');

      const agentsRes = await fetch('/api/candidates/evaluate-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: extracted.profile,
          evidenceStore: extracted.evidenceStore,
          jobDescription: extracted.jobDescription,
        }),
      });

      if (!agentsRes.ok) {
        const errData = await agentsRes.json();
        throw new Error(errData.error || 'Failed to run agent evaluation');
      }

      const { assessments: rawAssessments } = await agentsRes.json();
      setAssessments(rawAssessments);

      // Step 4: Disagreement Detection
      setPipelineStep(4);
      setStepTitle('Disagreement & Tension Detection');
      setStepDescription('Comparing independent assessments to surface key disputes...');
      setPipelineStatus('Detecting Disputes');

      const disputesRes = await fetch('/api/candidates/detect-disagreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessments: rawAssessments,
          evidenceStore: extracted.evidenceStore,
          jobDescription: extracted.jobDescription,
        }),
      });

      const { disputes: detectedDisputes } = await disputesRes.json();
      setDisputes(detectedDisputes || []);

      // Step 5: Multi-Turn Debate
      setPipelineStep(5);
      setStepTitle('Multi-Turn Debate & Calibration');
      setStepDescription('Conducting turn-based challenge, rebuttal, and position revisions...');
      setPipelineStatus('Running Debate');

      const debateRes = await fetch('/api/candidates/run-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessments: rawAssessments,
          disputes: detectedDisputes || [],
          profile: extracted.profile,
          evidenceStore: extracted.evidenceStore,
          jobDescription: extracted.jobDescription,
        }),
      });

      const debateData = await debateRes.json();
      setDebateMessages(debateData.debateMessages || []);
      setPositionRevisions(debateData.positionRevisions || []);
      if (debateData.updatedAssessments) {
        setAssessments(debateData.updatedAssessments);
      }

      // Step 6: Final Adjudication
      setPipelineStep(6);
      setStepTitle('Evidence-Weighted Adjudication');
      setStepDescription('Chief Adjudicator synthesizing debate outcomes (non-averaging)...');
      setPipelineStatus('Adjudicating Dossier');

      const adjRes = await fetch('/api/candidates/adjudicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: extracted.profile,
          jobDescription: extracted.jobDescription,
          evidenceStore: extracted.evidenceStore,
          assessments: debateData.updatedAssessments || rawAssessments,
          debateMessages: debateData.debateMessages || [],
          positionRevisions: debateData.positionRevisions || [],
        }),
      });

      const { finalDecision: finalDec } = await adjRes.json();
      setFinalDecision(finalDec);
      setActiveTab('dossier');
    } catch (err: any) {
      console.error('Pipeline execution error:', err);
      setErrorMessage(err.message || 'An error occurred during multi-agent evaluation.');
    } finally {
      setIsProcessing(false);
      setPipelineStatus('');
    }
  };

  const handleRunCurrentPipeline = () => {
    const currentSample = SAMPLE_CANDIDATES.find((c) => c.id === selectedCandidateId);
    if (currentSample) {
      runFullPipelineForCandidate(
        currentSample.resumeRawText,
        currentSample.transcriptRawText,
        currentSample.jobDescriptionRawText
      );
    } else {
      // Fallback
      runFullPipelineForCandidate(
        JSON.stringify(profile),
        '',
        JSON.stringify(jobDescription)
      );
    }
  };

  const handleAnalyzeCustom = (data: {
    resumeText: string;
    transcriptText: string;
    jobDescriptionText: string;
    candidateName?: string;
  }) => {
    setIsUploadModalOpen(false);
    setSelectedCandidateId('custom-candidate');
    runFullPipelineForCandidate(data.resumeText, data.transcriptText, data.jobDescriptionText);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#121212] flex flex-col font-sans selection:bg-[#D94F33] selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        benchmarkCandidates={SAMPLE_CANDIDATES}
        selectedCandidateId={selectedCandidateId}
        onSelectCandidate={handleSelectCandidate}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onRunFullPipeline={handleRunCurrentPipeline}
        isProcessing={isProcessing}
        pipelineStatus={pipelineStatus}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] text-[#A82A2A] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-[#D94F33] shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleRunCurrentPipeline}
                className="px-2.5 py-1 bg-[#D94F33] hover:bg-[#C03E24] text-white rounded-xs font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1 bg-[#F0C4BD] hover:bg-[#E5ACA3] rounded-xs font-bold text-[10px] uppercase tracking-wider text-[#A82A2A] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Candidate Context Ribbon */}
        <div className="p-4 sm:p-5 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#57534E]">Dossier Record:</span>
              <span className="font-serif-editorial font-bold text-[#121212] text-base">{profile.name}</span>
            </div>
            <span className="text-[#121212]/30">•</span>
            <span className="text-[#D94F33] font-bold font-serif-editorial text-sm">{jobDescription.title}</span>
            <span className="text-[#121212]/30">•</span>
            <span className="text-[#57534E] font-mono text-[11px]">
              {evidenceStore.length} Verified Evidence Snippets
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {profile.contradictions && profile.contradictions.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab('evidence')}
                className="px-3 py-1 rounded-xs bg-[#FDF0EE] text-[#A82A2A] border border-[#F0C4BD] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#F9DFDC] transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#D94F33]" />
                <span>{profile.contradictions.length} Contradictions Flagged</span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded-xs bg-[#E9F2EC] text-[#2D5A3F] border border-[#B4D5C2] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#2D5A3F]" />
                <span>0 Document Inconsistencies</span>
              </span>
            )}

            {positionRevisions && positionRevisions.some((r) => r.changed) && (
              <button
                type="button"
                onClick={() => setActiveTab('debate')}
                className="px-3 py-1 rounded-xs bg-[#FAF0E6] text-[#8C510A] border border-[#E5CFB8] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 hover:bg-[#F5E4D3] transition-colors cursor-pointer"
              >
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#C2781D]" />
                <span>Debate Position Calibrated</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Views */}
        <div className="focus:outline-hidden">
          {activeTab === 'dossier' && finalDecision && (
            <section
              id="tabpanel-dossier"
              role="tabpanel"
              aria-labelledby="nav-tab-dossier"
              tabIndex={0}
              className="focus:outline-hidden"
            >
              <FinalReportView
                decision={finalDecision}
                profile={profile}
                jobDescription={jobDescription}
                assessments={assessments}
                evidenceStore={evidenceStore}
                onSelectEvidence={(id) => setSelectedEvidenceId(id)}
              />
            </section>
          )}

          {activeTab === 'personas' && (
            <section
              id="tabpanel-personas"
              role="tabpanel"
              aria-labelledby="nav-tab-personas"
              tabIndex={0}
              className="focus:outline-hidden"
            >
              <AgentCardsGrid
                assessments={assessments}
                positionRevisions={positionRevisions}
                evidenceStore={evidenceStore}
                onSelectEvidence={(id) => setSelectedEvidenceId(id)}
              />
            </section>
          )}

          {activeTab === 'debate' && (
            <section
              id="tabpanel-debate"
              role="tabpanel"
              aria-labelledby="nav-tab-debate"
              tabIndex={0}
              className="focus:outline-hidden"
            >
              <DebateRoom
                debateMessages={debateMessages}
                disputes={disputes}
                positionRevisions={positionRevisions}
                evidenceStore={evidenceStore}
                onSelectEvidence={(id) => setSelectedEvidenceId(id)}
              />
            </section>
          )}

          {activeTab === 'evidence' && (
            <section
              id="tabpanel-evidence"
              role="tabpanel"
              aria-labelledby="nav-tab-evidence"
              tabIndex={0}
              className="focus:outline-hidden"
            >
              <EvidenceExplorer
                evidenceStore={evidenceStore}
                contradictions={profile.contradictions || []}
                onSelectEvidence={(id) => setSelectedEvidenceId(id)}
              />
            </section>
          )}

          {activeTab === 'profile' && (
            <section
              id="tabpanel-profile"
              role="tabpanel"
              aria-labelledby="nav-tab-profile"
              tabIndex={0}
              className="focus:outline-hidden"
            >
              <CandidateProfileView
                profile={profile}
                jobDescription={jobDescription}
                evidenceStore={evidenceStore}
                onSelectEvidence={(id) => setSelectedEvidenceId(id)}
              />
            </section>
          )}
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#121212]/15 bg-[#FDFCFB] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#57534E]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif-editorial font-bold text-[#121212]">AI Hiring Panel</span>
            <span>—</span>
            <span>Editorial Multi-Agent Deliberation & Adjudication Journal</span>
          </div>
          <div className="font-mono text-[11px]">Powered by Google Gemini 3.7 Flash</div>
        </div>
      </footer>

      {/* Evidence Citation Modal */}
      <EvidenceModal
        evidenceId={selectedEvidenceId}
        evidenceStore={evidenceStore}
        contradictions={profile.contradictions}
        onClose={() => setSelectedEvidenceId(null)}
      />

      {/* Upload Custom Candidate Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAnalyzeCustom={handleAnalyzeCustom}
        isProcessing={isProcessing}
      />

      {/* Real-time Pipeline Progress Modal */}
      <PipelineProgressModal
        isOpen={isProcessing}
        currentStep={pipelineStep}
        stepTitle={stepTitle}
        stepDescription={stepDescription}
      />
    </div>
  );
}
