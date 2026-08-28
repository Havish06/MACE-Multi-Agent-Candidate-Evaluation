import { describe, it, expect, vi } from 'vitest';
import {
  saveEvaluationToFirestore,
  loadEvaluationFromFirestore,
  listUserEvaluations,
} from '../lib/evaluationsService';
import { DEFAULT_SESSIONS } from '../data/defaultSessions';
import { CandidateEvaluationSession } from '../types';

// Mock Firebase module
vi.mock('../lib/firebase', () => {
  const store = new Map<string, any>();

  return {
    db: {},
    doc: (_db: any, col: string, id: string) => `${col}/${id}`,
    setDoc: async (docRef: string, data: any) => {
      store.set(docRef, data);
      return Promise.resolve();
    },
    getDoc: async (docRef: string) => {
      const data = store.get(docRef);
      return {
        exists: () => Boolean(data),
        data: () => data,
      };
    },
    getDocs: async (_q: any) => {
      const docs: any[] = [];
      store.forEach((val) => {
        docs.push({ id: val.id, data: () => val });
      });
      return docs;
    },
    collection: (_db: any, name: string) => name,
    query: (col: string) => col,
    where: () => {},
  };
});

describe('Evaluations Firestore Persistence Service', () => {
  const sampleSession = DEFAULT_SESSIONS['cand-alex-rivera'];

  it('persists evaluation session to Firestore with serialized payload', async () => {
    const mockUser = {
      uid: 'evaluator-123',
      email: 'lead@hiringpanel.com',
      displayName: 'Lead Evaluator',
      isAnonymous: false,
    } as any;

    const result = await saveEvaluationToFirestore(sampleSession, mockUser);
    expect(result).toBe(true);
  });

  it('retrieves saved evaluation session from Firestore', async () => {
    const loaded = await loadEvaluationFromFirestore(sampleSession.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(sampleSession.id);
    expect(loaded?.candidateName).toBe(sampleSession.candidateName);
    expect(loaded?.finalDecision?.recommendation).toBe(sampleSession.finalDecision?.recommendation);
  });

  it('handles non-existent evaluation gracefully by returning null', async () => {
    const nonExistent = await loadEvaluationFromFirestore('non-existent-candidate-id');
    expect(nonExistent).toBeNull();
  });

  it('lists evaluations for user', async () => {
    const list = await listUserEvaluations('evaluator-123');
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].id).toBe(sampleSession.id);
  });
});
