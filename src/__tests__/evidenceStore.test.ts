import { describe, it, expect } from 'vitest';
import { SAMPLE_CANDIDATES } from '../data/sampleCandidates';

describe('Evidence Store & Contradiction Verification', () => {
  it('contains correctly formatted evidence IDs in all benchmark candidates', () => {
    SAMPLE_CANDIDATES.forEach((candidate) => {
      expect(candidate.evidenceStore).toBeDefined();
      expect(candidate.evidenceStore.length).toBeGreaterThan(0);

      candidate.evidenceStore.forEach((item) => {
        expect(item.id).toMatch(/^E\d+/);
        expect(item.text).toBeTruthy();
        expect(item.source).toBeTruthy();
        expect(item.type).toBeDefined();
      });
    });
  });

  it('correctly maps contradictions between resume claims and registrar transcripts', () => {
    const alex = SAMPLE_CANDIDATES[0];
    const contradictions = alex.candidateProfile.contradictions;
    expect(contradictions).toBeDefined();
    expect(contradictions.length).toBeGreaterThan(0);

    const gpaDiscrepancy = contradictions.find((c) => c.topic.toLowerCase().includes('gpa'));
    expect(gpaDiscrepancy).toBeDefined();
    expect(gpaDiscrepancy?.severity).toBe('high');
    expect(gpaDiscrepancy?.resumeEvidenceId).toBe('E012');
    expect(gpaDiscrepancy?.transcriptEvidenceId).toBe('E001');
  });

  it('verifies Sarah Chen has Summa Cum Laude with zero contradictions', () => {
    const sarah = SAMPLE_CANDIDATES[1];
    expect(sarah.candidateProfile.contradictions).toEqual([]);
    const gpaEvidence = sarah.evidenceStore.find((e) => e.id === 'E101');
    expect(gpaEvidence?.text).toContain('3.95');
    expect(gpaEvidence?.text).toContain('Summa Cum Laude');
  });

  it('verifies Marcus Vance has flagged severe GPA fabrication', () => {
    const marcus = SAMPLE_CANDIDATES[2];
    const contradictions = marcus.candidateProfile.contradictions;
    expect(contradictions.length).toBeGreaterThan(0);
    const fab = contradictions.find((c) => c.id === 'C201');
    expect(fab).toBeDefined();
    expect(fab?.severity).toBe('high');
  });
});
