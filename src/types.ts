export type AgentType = 'technical' | 'hr' | 'hiring_manager' | 'skeptic' | 'adjudicator';

export type RecommendationType = 'STRONG_HIRE' | 'HIRE' | 'INTERVIEW' | 'MAYBE' | 'NO_HIRE';
export type AgentRecommendation = 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO' | 'STRONG_NO';

export type StanceType = 'agree' | 'disagree' | 'partially_agree' | 'challenge' | 'defend' | 'concede';

export interface EvidenceItem {
  id: string; // e.g. E001, E017
  source: string; // 'resume.pdf', 'transcript.pdf', 'job_description.txt'
  pageOrSection: string; // 'Page 1', 'Page 2', 'Academic Record'
  text: string; // Original exact text
  type: 'technical_claim' | 'education_fact' | 'experience' | 'project' | 'behavioral' | 'achievement' | 'grade' | 'contradiction';
  confidence: number; // 0 to 1
  metadata?: Record<string, any>;
}

export interface ContradictionItem {
  id: string; // e.g. C001
  topic: string;
  resumeClaim: string;
  resumeEvidenceId: string;
  transcriptFact: string;
  transcriptEvidenceId: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  targetRole: string;
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    major: string;
    gpa?: string;
    graduationYear?: string;
    evidenceId: string;
  }>;
  courses: Array<{
    courseName: string;
    grade: string;
    semester?: string;
    evidenceId: string;
  }>;
  skills: Array<{
    name: string;
    category: 'technical' | 'soft' | 'domain';
    levelClaimed: 'proficient' | 'familiar' | 'advanced' | 'expert';
    evidenceIds: string[];
    isVerifiedByProjectOrCourse: boolean;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
    evidenceIds: string[];
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    description: string;
    evidenceIds: string[];
  }>;
  claims: Array<{
    id: string;
    statement: string;
    evidenceId: string;
    verificationStatus: 'verified' | 'unsupported' | 'contradicted' | 'partially_supported';
  }>;
  contradictions: ContradictionItem[];
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  experienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | 'lead';
  overview: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string[];
  responsibilities: string[];
  technicalRequirements: string[];
  softSkillRequirements: string[];
}

export interface StrengthOrConcern {
  statement: string;
  evidenceIds: string[];
  weight: 'critical' | 'high' | 'moderate';
}

export interface AgentAssessment {
  agentType: AgentType;
  agentName: string;
  personaTitle: string;
  avatarColor: string;
  recommendation: AgentRecommendation;
  confidence: number; // 0 to 100
  strengths: StrengthOrConcern[];
  concerns: StrengthOrConcern[];
  supportedClaims: string[]; // Evidence IDs
  unsupportedClaims: string[]; // Evidence IDs or Claim descriptions
  contradictedClaims: string[];
  keyReasoning: string;
  debateQuestions: string[];
  timestamp: string;
}

export interface DisputeTopic {
  id: string; // e.g. DISPUTE-001
  topic: string;
  description: string;
  initiatingAgent: AgentType;
  opposingAgent: AgentType;
  tensionLevel: 'high' | 'medium' | 'low';
  coreEvidenceIds: string[];
}

export interface DebateMessage {
  id: string;
  round: number;
  speaker: AgentType;
  speakerName: string;
  respondingTo?: AgentType;
  stance: StanceType;
  message: string;
  evidenceIds: string[];
  previousConfidence?: number;
  newConfidence?: number;
  changedPosition: boolean;
  revisionReason?: string;
  timestamp: string;
}

export interface PositionRevisionRecord {
  agentType: AgentType;
  agentName: string;
  initialRecommendation: AgentRecommendation;
  initialConfidence: number;
  postDebateRecommendation: AgentRecommendation;
  postDebateConfidence: number;
  changed: boolean;
  reason: string;
  triggerMessageId?: string;
}

export interface FinalDecision {
  recommendation: RecommendationType;
  confidence: number; // 0 to 100
  executiveSummary: string;
  evidenceWeightedReasoning: string;
  strengths: StrengthOrConcern[];
  concerns: StrengthOrConcern[];
  resolvedDisagreements: Array<{
    disputeTopic: string;
    resolution: string;
    prevailingArgument: string;
    evidenceIds: string[];
  }>;
  unresolvedDisagreements: Array<{
    disputeTopic: string;
    whyUnresolved: string;
    suggestedInterviewProbe: string;
  }>;
  positionRevisions: PositionRevisionRecord[];
  interviewQuestions: Array<{
    question: string;
    targetArea: string;
    whyNeeded: string;
    relatedEvidenceId?: string;
  }>;
  hiringRubricCoverage: Array<{
    criterion: string;
    score: number; // 1 to 5
    evidenceSupport: string;
  }>;
  timestamp: string;
}

export interface CandidateEvaluationSession {
  id: string;
  createdAt: string;
  candidateName: string;
  roleTitle: string;
  candidateProfile: CandidateProfile;
  jobDescription: JobDescription;
  evidenceStore: EvidenceItem[];
  independentAssessments: Record<AgentType, AgentAssessment>;
  disputes: DisputeTopic[];
  debateMessages: DebateMessage[];
  finalDecision?: FinalDecision;
  status: 'idle' | 'extracting' | 'evaluating_agents' | 'detecting_disputes' | 'debating' | 'adjudicating' | 'completed' | 'error';
  errorMessage?: string;
}
