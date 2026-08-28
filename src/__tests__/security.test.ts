import { describe, it, expect } from 'vitest';

describe('Security & Input Validation Tests', () => {
  it('handles empty and malformed candidate document inputs gracefully', () => {
    const sanitizeText = (raw: string) => {
      if (!raw || typeof raw !== 'string') return '';
      return raw.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };

    expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('Hello');
    expect(sanitizeText('')).toBe('');
  });

  it('validates confidence scores within bounds [0, 100]', () => {
    const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));
    expect(clampScore(120)).toBe(100);
    expect(clampScore(-15)).toBe(0);
    expect(clampScore(84.7)).toBe(85);
  });

  it('validates evidence citation ID format', () => {
    const isValidEvidenceId = (id: string) => /^E\d{3,}$/.test(id);
    expect(isValidEvidenceId('E001')).toBe(true);
    expect(isValidEvidenceId('E108')).toBe(true);
    expect(isValidEvidenceId('DROP TABLE')).toBe(false);
    expect(isValidEvidenceId('../../etc/passwd')).toBe(false);
  });
});
