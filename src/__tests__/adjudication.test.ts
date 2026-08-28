import { describe, it, expect } from 'vitest';
import { DEFAULT_SESSIONS } from '../data/defaultSessions';
import { SAMPLE_CANDIDATES } from '../data/sampleCandidates';

describe('Adjudication & Consensus Decision Engine', () => {
  it('loads precomputed deliberation sessions for all benchmark candidates', () => {
    SAMPLE_CANDIDATES.forEach((c) => {
      const session = DEFAULT_SESSIONS[c.id];
      expect(session).toBeDefined();
      expect(session?.candidateName).toBe(c.name);
      expect(session?.finalDecision).toBeDefined();
      expect(session?.finalDecision?.recommendation).toBeDefined();
      expect(session?.finalDecision?.confidence).toBeGreaterThan(0);
      expect(session?.finalDecision?.confidence).toBeLessThanOrEqual(100);
    });
  });

  it('validates 4 independent persona assessments for Alex Rivera', () => {
    const session = DEFAULT_SESSIONS['cand-alex-rivera'];
    expect(session).toBeDefined();
    const { independentAssessments } = session!;

    expect(independentAssessments.technical).toBeDefined();
    expect(independentAssessments.hr).toBeDefined();
    expect(independentAssessments.hiring_manager).toBeDefined();
    expect(independentAssessments.skeptic).toBeDefined();

    // Technical architect should lean yes/strong yes
    expect(['YES', 'STRONG_YES']).toContain(independentAssessments.technical.recommendation);
    // Skeptic should have calibrated caution / concerns
    expect(['NO', 'STRONG_NO', 'MAYBE']).toContain(independentAssessments.skeptic.recommendation);
  });

  it('verifies position calibration and debate messages exist in multi-round deliberation', () => {
    const session = DEFAULT_SESSIONS['cand-alex-rivera'];
    expect(session).toBeDefined();
    expect(session!.debateMessages.length).toBeGreaterThan(0);
    expect(session!.disputes.length).toBeGreaterThan(0);

    const changedTurn = session!.debateMessages.find((m) => m.changedPosition);
    if (changedTurn) {
      expect(changedTurn.newConfidence).toBeDefined();
    }
  });

  it('verifies rubric scoring has all 4 required evaluation pillars', () => {
    const session = DEFAULT_SESSIONS['cand-sarah-chen'];
    expect(session?.finalDecision).toBeDefined();
    const rubric = session!.finalDecision!.hiringRubricCoverage;
    expect(rubric.length).toBeGreaterThanOrEqual(4);

    rubric.forEach((item) => {
      expect(item.score).toBeGreaterThanOrEqual(1);
      expect(item.score).toBeLessThanOrEqual(5);
      expect(item.evidenceSupport).toBeTruthy();
    });
  });
});
