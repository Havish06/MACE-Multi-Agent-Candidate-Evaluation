import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  type User,
} from './firebase';
import { CandidateEvaluationSession } from '../types';

export interface SavedEvaluationMetadata {
  id: string;
  candidateName: string;
  roleTitle: string;
  createdAt: string;
  verdict?: string;
  confidence?: number;
  ownerId?: string;
}

/**
 * Persists an evaluation session to Firestore
 */
export async function saveEvaluationToFirestore(
  session: CandidateEvaluationSession,
  user: User | null
): Promise<boolean> {
  if (!session || !session.id) return false;

  try {
    const ownerId = user ? user.uid : 'anonymous-local';
    const evalDocRef = doc(db, 'evaluations', session.id);

    const payload = {
      id: session.id,
      candidateId: session.id,
      candidateName: session.candidateName,
      roleTitle: session.roleTitle,
      createdAt: session.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId,
      verdict: session.finalDecision?.recommendation || 'PENDING',
      confidence: session.finalDecision?.confidence || 0,
      sessionData: JSON.stringify(session),
    };

    await setDoc(evalDocRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore sync skipped or unavailable:', error);
    return false;
  }
}

/**
 * Loads an evaluation session from Firestore
 */
export async function loadEvaluationFromFirestore(
  sessionId: string
): Promise<CandidateEvaluationSession | null> {
  if (!sessionId) return null;

  try {
    const evalDocRef = doc(db, 'evaluations', sessionId);
    const docSnap = await getDoc(evalDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.sessionData) {
        return JSON.parse(data.sessionData) as CandidateEvaluationSession;
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not load evaluation from Firestore:', error);
    return null;
  }
}

/**
 * Lists evaluations for the authenticated user
 */
export async function listUserEvaluations(
  userId: string
): Promise<SavedEvaluationMetadata[]> {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, 'evaluations'),
      where('ownerId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const list: SavedEvaluationMetadata[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: data.id || doc.id,
        candidateName: data.candidateName || 'Unknown Candidate',
        roleTitle: data.roleTitle || 'Applicant',
        createdAt: data.createdAt || new Date().toISOString(),
        verdict: data.verdict,
        confidence: data.confidence,
        ownerId: data.ownerId,
      });
    });

    return list;
  } catch (error) {
    console.warn('Could not fetch user evaluations list:', error);
    return [];
  }
}
