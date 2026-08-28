import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { SAMPLE_CANDIDATES } from '../data/sampleCandidates';
import { DEFAULT_SESSIONS } from '../data/defaultSessions';
import { AgentCardsGrid } from '../components/AgentCardsGrid';
import { DebateRoom } from '../components/DebateRoom';
import { EvidenceExplorer } from '../components/EvidenceExplorer';
import { CandidateProfileView } from '../components/CandidateProfileView';
import { FinalReportView } from '../components/FinalReportView';
import { AuthProvider } from '../lib/AuthContext';

describe('UI Components & Accessibility Verification', () => {
  const mockCandidate = SAMPLE_CANDIDATES[0];
  const mockSession = DEFAULT_SESSIONS['cand-alex-rivera'];

  it('renders Header with accessible buttons and semantic navigation', () => {
    render(
      <AuthProvider>
        <Header
          activeTab="dossier"
          setActiveTab={() => {}}
          benchmarkCandidates={SAMPLE_CANDIDATES}
          selectedCandidateId={mockCandidate.id}
          onSelectCandidate={() => {}}
          onOpenUploadModal={() => {}}
          onRunFullPipeline={() => {}}
          isProcessing={false}
          pipelineStatus=""
          hasGeminiKey={true}
        />
      </AuthProvider>
    );

    expect(screen.getByText(/MACE/i)).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /Evaluation Navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Adjudication Dossier/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('renders EvidenceBadge with accessible role and title', () => {
    render(
      <EvidenceBadge
        id="E001"
        evidenceStore={mockCandidate.evidenceStore}
        onSelectEvidence={() => {}}
      />
    );

    const badge = screen.getByRole('button', { name: /Evidence citation E001/i });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('title');
  });

  it('renders AgentCardsGrid with all 4 independent evaluator cards', () => {
    render(
      <AgentCardsGrid
        assessments={mockSession.independentAssessments}
        evidenceStore={mockSession.evidenceStore}
        onSelectEvidence={() => {}}
      />
    );

    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcus Vance-Cole/i)).toBeInTheDocument();
    expect(screen.getByText(/David Sterling/i)).toBeInTheDocument();
    expect(screen.getByText(/Arthur Pendelton/i)).toBeInTheDocument();
  });

  it('renders DebateRoom with voice controls and dispute topics', () => {
    render(
      <DebateRoom
        debateMessages={mockSession.debateMessages}
        disputes={mockSession.disputes}
        evidenceStore={mockSession.evidenceStore}
        onSelectEvidence={() => {}}
      />
    );

    expect(screen.getByText(/Interactive Voice Debate Chamber/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Voice Debate|Pause Audio/i })).toBeInTheDocument();
  });

  it('renders EvidenceExplorer with searchable evidence and contradiction badges', () => {
    render(
      <EvidenceExplorer
        evidenceStore={mockCandidate.evidenceStore}
        contradictions={mockCandidate.candidateProfile.contradictions}
        onSelectEvidence={() => {}}
      />
    );

    expect(screen.getByPlaceholderText(/Search evidence/i)).toBeInTheDocument();
  });

  it('renders CandidateProfileView with education and skills', () => {
    render(
      <CandidateProfileView
        profile={mockCandidate.candidateProfile}
        jobDescription={mockCandidate.jobDescription}
        evidenceStore={mockCandidate.evidenceStore}
        onSelectEvidence={() => {}}
      />
    );

    expect(screen.getByText(mockCandidate.candidateProfile.name)).toBeInTheDocument();
  });

  it('renders FinalReportView with consensus decision metrics', () => {
    if (!mockSession.finalDecision) throw new Error('Missing mock finalDecision');

    render(
      <FinalReportView
        decision={mockSession.finalDecision}
        profile={mockCandidate.candidateProfile}
        jobDescription={mockCandidate.jobDescription}
        assessments={mockSession.independentAssessments}
        evidenceStore={mockCandidate.evidenceStore}
        onSelectEvidence={() => {}}
      />
    );

    expect(screen.getByText(/Official Verdict/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Adjudication Summary/i)).toBeInTheDocument();
  });
});
