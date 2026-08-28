import { CandidateEvaluationSession } from '../types';
import { SAMPLE_CANDIDATES } from './sampleCandidates';

export const DEFAULT_SESSIONS: Record<string, CandidateEvaluationSession> = {
  'cand-alex-rivera': {
    id: 'session-alex-rivera',
    createdAt: new Date().toISOString(),
    candidateName: 'Alex Rivera',
    roleTitle: 'Machine Learning & Backend Engineer',
    candidateProfile: SAMPLE_CANDIDATES[0].candidateProfile,
    jobDescription: SAMPLE_CANDIDATES[0].jobDescription,
    evidenceStore: SAMPLE_CANDIDATES[0].evidenceStore,
    status: 'completed',
    independentAssessments: {
      technical: {
        agentType: 'technical',
        agentName: 'Dr. Elena Rostova',
        personaTitle: 'Principal Technical Architect',
        avatarColor: 'blue',
        recommendation: 'YES',
        confidence: 76,
        strengths: [
          { statement: 'Built high-throughput ML inference pipeline in FastAPI serving 120k requests/day', evidenceIds: ['E008'], weight: 'critical' },
          { statement: 'Implemented HNSW graph vector search engine in Rust with sub-10ms latency', evidenceIds: ['E009'], weight: 'critical' },
          { statement: 'Earned grade A (4.0) in Machine Learning and Database Systems coursework', evidenceIds: ['E002', 'E003'], weight: 'high' }
        ],
        concerns: [
          { statement: 'Academic transcript shows C+ in Design & Analysis of Algorithms', evidenceIds: ['E004'], weight: 'high' },
          { statement: 'Resume claim of 3.8 GPA contradicts official transcript GPA of 3.42', evidenceIds: ['E012', 'E001'], weight: 'critical' }
        ],
        supportedClaims: ['E008', 'E009', 'E002', 'E003'],
        unsupportedClaims: [],
        contradictedClaims: ['E012'],
        keyReasoning: 'Strong practical systems and ML inference implementation track record in both Python and Rust. The C+ in Algorithms is offset by working code in graph search, though it warrants dedicated technical screening.',
        debateQuestions: ['Can candidate explain complexity analysis and graph traversal proof tradeoffs live?'],
        timestamp: new Date().toISOString()
      },
      hr: {
        agentType: 'hr',
        agentName: 'Marcus Vance-Cole',
        personaTitle: 'Head of People & Culture',
        avatarColor: 'emerald',
        recommendation: 'YES',
        confidence: 80,
        strengths: [
          { statement: 'Led agile sprint planning and presented demos for a 4-person intern team', evidenceIds: ['E010'], weight: 'high' },
          { statement: 'Maintains active open-source collaboration with 1,200+ GitHub community stars', evidenceIds: ['E009'], weight: 'high' }
        ],
        concerns: [
          { statement: 'Discrepancy on resume GPA requires behavioral explanation regarding transparency', evidenceIds: ['E012', 'E001'], weight: 'critical' }
        ],
        supportedClaims: ['E010', 'E009'],
        unsupportedClaims: [],
        contradictedClaims: ['E012'],
        keyReasoning: 'Demonstrated initiative and leadership during internship. The resume GPA inflation must be addressed as a direct integrity check during interview screening.',
        debateQuestions: ['How did the candidate measure team sprint velocity and handle sprint blockers?'],
        timestamp: new Date().toISOString()
      },
      hiring_manager: {
        agentType: 'hiring_manager',
        agentName: 'David Sterling',
        personaTitle: 'Engineering Director & Hiring Lead',
        avatarColor: 'indigo',
        recommendation: 'YES',
        confidence: 78,
        strengths: [
          { statement: 'Immediately role-ready for vector search and backend microservices delivery', evidenceIds: ['E008', 'E009'], weight: 'critical' },
          { statement: 'Reduced vector similarity search latency by 42% in PostgreSQL environment', evidenceIds: ['E008'], weight: 'high' }
        ],
        concerns: [
          { statement: 'Short commercial tenure (3 months internship) necessitates verification of production discipline', evidenceIds: ['E008'], weight: 'moderate' }
        ],
        supportedClaims: ['E008', 'E009'],
        unsupportedClaims: [],
        contradictedClaims: ['E012'],
        keyReasoning: 'From a business deliverable standpoint, the candidate demonstrates rare hands-on capability in Rust and vector search that directly accelerates our roadmap.',
        debateQuestions: ['Would the candidate be able to independently debug live distributed database deadlocks?'],
        timestamp: new Date().toISOString()
      },
      skeptic: {
        agentType: 'skeptic',
        agentName: 'Arthur Pendelton',
        personaTitle: 'Chief Evaluation Skeptic & Risk Auditor',
        avatarColor: 'rose',
        recommendation: 'MAYBE',
        confidence: 68,
        strengths: [
          { statement: 'Verified GitHub code repository demonstrating Rust HNSW implementation', evidenceIds: ['E009'], weight: 'high' }
        ],
        concerns: [
          { statement: 'Direct resume inflation: Self-reported GPA 3.8 vs Official Transcript 3.42', evidenceIds: ['E012', 'E001'], weight: 'critical' },
          { statement: 'Coursework failure in theoretical rigor: Grade C+ in foundational Algorithms', evidenceIds: ['E004'], weight: 'critical' },
          { statement: 'Leadership claim of managing 4 engineers during brief 12-week internship is likely embellished', evidenceIds: ['E010'], weight: 'high' }
        ],
        supportedClaims: ['E009'],
        unsupportedClaims: ['E010'],
        contradictedClaims: ['E012'],
        keyReasoning: 'We cannot overlook deliberate GPA inflation and poor exam performance in Algorithms. High-profile open-source code can mask theoretical gaps or external template copying.',
        debateQuestions: ['Why did the candidate publish 3.8 on the resume header when the registrar stamped 3.42?'],
        timestamp: new Date().toISOString()
      },
      adjudicator: {
        agentType: 'adjudicator',
        agentName: 'Chief Adjudication Council',
        personaTitle: 'Adjudication Chair',
        avatarColor: 'violet',
        recommendation: 'YES',
        confidence: 82,
        strengths: [],
        concerns: [],
        supportedClaims: [],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Adjudicator state synthesis',
        debateQuestions: [],
        timestamp: new Date().toISOString()
      }
    },
    disputes: [
      {
        id: 'DISPUTE-001',
        topic: 'Practical Rust Implementation vs. Academic Algorithms Grade (C+)',
        description: 'Technical agent asserts working HNSW vector search proves algorithmic capability; Skeptic argues textbook algorithms deficiency indicates fragility.',
        initiatingAgent: 'skeptic',
        opposingAgent: 'technical',
        tensionLevel: 'high',
        coreEvidenceIds: ['E004', 'E009', 'E008']
      },
      {
        id: 'DISPUTE-002',
        topic: 'Resume GPA Inflation vs. Candidate Integrity',
        description: 'Resume states 3.8 GPA vs Official 3.42 GPA on transcript. HR sees it as a probe topic; Skeptic views it as an integrity red flag.',
        initiatingAgent: 'skeptic',
        opposingAgent: 'hr',
        tensionLevel: 'high',
        coreEvidenceIds: ['E012', 'E001']
      }
    ],
    debateMessages: [
      {
        id: 'MSG-01',
        round: 1,
        speaker: 'skeptic',
        speakerName: 'Arthur Pendelton',
        respondingTo: 'technical',
        stance: 'challenge',
        message: 'I challenge the technical recommendation. While the open-source repository in [E009] looks attractive, it does not erase the C+ in Algorithms [E004] and the blatant GPA exaggeration on the resume header [E012]. How can we trust their self-reported expertise without verified algorithmic foundations?',
        evidenceIds: ['E004', 'E009', 'E012'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'MSG-02',
        round: 2,
        speaker: 'technical',
        speakerName: 'Dr. Elena Rostova',
        respondingTo: 'skeptic',
        stance: 'partially_agree',
        message: 'Arthur is correct that the GPA discrepancy [E012] is troubling and the C+ in CS 301 [E004] cannot be ignored. However, writing an HNSW graph indexing engine in Rust [E009] requires practical pointer safety, memory layout, and distance metric optimization that goes far beyond rote exam memorization. That said, I concede the theoretical uncertainty and adjust my confidence from 84% down to 76%.',
        evidenceIds: ['E009', 'E004', 'E012'],
        changedPosition: true,
        previousConfidence: 84,
        newConfidence: 76,
        revisionReason: 'Conceded Skeptic points on theoretical grade disparity while defending verified Rust systems implementation.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'MSG-03',
        round: 2,
        speaker: 'hr',
        speakerName: 'Marcus Vance-Cole',
        respondingTo: 'skeptic',
        stance: 'defend',
        message: 'Regarding leadership and integrity: The GPA [E012] must be verified with the candidate directly. But behavioral evidence [E008] and [E010] shows they collaborated effectively, delivered sprint demos, and mentored fellow interns. We shouldn’t reject an exceptional engineer before giving them a chance to explain.',
        evidenceIds: ['E008', 'E010', 'E012'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'MSG-04',
        round: 3,
        speaker: 'hiring_manager',
        speakerName: 'David Sterling',
        respondingTo: 'technical',
        stance: 'agree',
        message: 'With Elena’s calibrated technical confidence and Marcus’s interview guardrails, the path is clear. The business value of their vector search expertise [E009] is immense. We will proceed to an on-site interview with targeted algorithmic proofs to test for gaps.',
        evidenceIds: ['E008', 'E009'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      }
    ],
    finalDecision: {
      recommendation: 'INTERVIEW',
      confidence: 82,
      executiveSummary: 'After synthesizing independent evaluations and a 3-round debate between Technical, HR, Hiring Manager, and Skeptic personas, the panel unanimously recommends advancing Alex Rivera to a targeted technical interview. The decision balances strong verified open-source deliverables against academic discrepancies.',
      evidenceWeightedReasoning: 'Rather than averaging agent scores, the adjudication weighed the quality of verified project artifacts (Rust HNSW engine E009, FastAPI pipeline E008) against the academic concerns raised by the Skeptic (GPA discrepancy E012 and Algorithms grade E004). The prevailing conclusion is that working systems artifacts prove applied talent, while the interview stage must specifically probe theoretical complexity and GPA calculation methodology.',
      strengths: [
        { statement: 'Demonstrated high-throughput ML pipeline engineering serving 120k requests/day', evidenceIds: ['E008'], weight: 'critical' },
        { statement: 'Open-source Rust HNSW vector search engine with 1,200+ community stars', evidenceIds: ['E009'], weight: 'critical' },
        { statement: 'A grades in Machine Learning (CS 410) and Database Systems (CS 340)', evidenceIds: ['E002', 'E003'], weight: 'high' }
      ],
      concerns: [
        { statement: 'Resume claim of 3.8 GPA contradicts official transcript GPA of 3.42', evidenceIds: ['E012', 'E001'], weight: 'critical' },
        { statement: 'Grade C+ in foundational Design & Analysis of Algorithms coursework', evidenceIds: ['E004'], weight: 'high' }
      ],
      resolvedDisagreements: [
        {
          disputeTopic: 'Practical Systems Implementation vs Academic Exam Performance',
          resolution: 'Panel agreed that working codebase in Rust demonstrates genuine capability, with live technical screening scheduled to verify theoretical depth.',
          prevailingArgument: 'Technical agent defense of working graph algorithms combined with Skeptic calibration.',
          evidenceIds: ['E009', 'E004']
        }
      ],
      unresolvedDisagreements: [
        {
          disputeTopic: 'Reason for Resume GPA Discrepancy',
          whyUnresolved: 'No written document explains the difference between 3.8 and 3.42.',
          suggestedInterviewProbe: 'Ask the candidate to explain whether the 3.8 was an in-major calculation or an error, and evaluate their transparency.'
        }
      ],
      positionRevisions: [
        {
          agentType: 'technical',
          agentName: 'Dr. Elena Rostova',
          initialRecommendation: 'STRONG_YES',
          initialConfidence: 84,
          postDebateRecommendation: 'YES',
          postDebateConfidence: 76,
          changed: true,
          reason: 'Calibrated confidence after acknowledging Skeptic challenges on transcript algorithm grade and GPA disparity.'
        }
      ],
      interviewQuestions: [
        {
          question: 'Can you walk through your HNSW graph construction algorithm and explain the time/space complexity tradeoffs of the M and efConstruction parameters?',
          targetArea: 'Algorithmic Complexity & Graph Search',
          whyNeeded: 'To verify deep algorithmic comprehension independently of the C+ transcript grade',
          relatedEvidenceId: 'E009'
        },
        {
          question: 'We noticed a 3.8 GPA listed on your resume versus 3.42 on the official transcript. Could you walk us through how that figure was derived?',
          targetArea: 'Transparency & Academic Records',
          whyNeeded: 'To resolve Contradiction C001 directly with the candidate',
          relatedEvidenceId: 'E012'
        },
        {
          question: 'How did you handle lock contention and vector indexing performance when integrating pgvector in PostgreSQL?',
          targetArea: 'Database Systems & Latency Optimization',
          whyNeeded: 'To verify claim of 42% latency reduction during internship',
          relatedEvidenceId: 'E008'
        }
      ],
      hiringRubricCoverage: [
        { criterion: 'Technical Depth & Architecture', score: 4, evidenceSupport: 'Supported by E008 and E009' },
        { criterion: 'Theoretical Algorithms Foundation', score: 3, evidenceSupport: 'C+ in CS 301 (E004), offset by working HNSW code' },
        { criterion: 'Collaboration & Team Contribution', score: 4, evidenceSupport: 'Supported by E010 sprint demos' },
        { criterion: 'Integrity & Data Accuracy', score: 2, evidenceSupport: 'Contradiction C001 flagged on resume GPA' }
      ],
      timestamp: new Date().toISOString()
    }
  },
  'cand-sarah-chen': {
    id: 'session-sarah-chen',
    createdAt: new Date().toISOString(),
    candidateName: 'Sarah Chen',
    roleTitle: 'Full Stack Software Engineer',
    candidateProfile: SAMPLE_CANDIDATES[1].candidateProfile,
    jobDescription: SAMPLE_CANDIDATES[1].jobDescription,
    evidenceStore: SAMPLE_CANDIDATES[1].evidenceStore,
    status: 'completed',
    independentAssessments: {
      technical: {
        agentType: 'technical',
        agentName: 'Dr. Elena Rostova',
        personaTitle: 'Principal Technical Architect',
        avatarColor: 'blue',
        recommendation: 'STRONG_YES',
        confidence: 94,
        strengths: [
          { statement: 'Engineered real-time CRDT collaborative canvas with automated E2E test coverage', evidenceIds: ['E108'], weight: 'critical' },
          { statement: 'Demonstrated front-end optimization improving Lighthouse performance from 62 to 96', evidenceIds: ['E106'], weight: 'high' },
          { statement: 'Flawless academic transcript: 4.0 in Web Systems, Algorithms, and Software Testing', evidenceIds: ['E102', 'E103', 'E104'], weight: 'high' }
        ],
        concerns: [],
        supportedClaims: ['E101', 'E102', 'E103', 'E104', 'E105', 'E106', 'E108'],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Exemplary technical execution across client, server, and test automation. Zero discrepancies identified.',
        debateQuestions: ['How were conflict resolution states handled in the CRDT collaborative whiteboard?'],
        timestamp: new Date().toISOString()
      },
      hr: {
        agentType: 'hr',
        agentName: 'Marcus Vance-Cole',
        personaTitle: 'Head of People & Culture',
        avatarColor: 'emerald',
        recommendation: 'STRONG_YES',
        confidence: 95,
        strengths: [
          { statement: 'Actively mentored junior interns and organized engineering lunch-and-learns', evidenceIds: ['E107'], weight: 'critical' },
          { statement: 'Consistent academic excellence graduating Summa Cum Laude with 3.95 GPA', evidenceIds: ['E101'], weight: 'high' }
        ],
        concerns: [],
        supportedClaims: ['E101', 'E107'],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Demonstrates exceptional cultural stewardship, leadership potential, and transparent communication.',
        debateQuestions: ['What feedback mechanisms did you establish during intern mentorship sessions?'],
        timestamp: new Date().toISOString()
      },
      hiring_manager: {
        agentType: 'hiring_manager',
        agentName: 'David Sterling',
        personaTitle: 'Engineering Director & Hiring Lead',
        avatarColor: 'indigo',
        recommendation: 'STRONG_YES',
        confidence: 92,
        strengths: [
          { statement: 'Built high-scale microservices handling 50k sessions and optimized core dashboards', evidenceIds: ['E105', 'E106'], weight: 'critical' },
          { statement: 'Proven cross-stack delivery from React/Tailwind frontend to Node/Redis caching', evidenceIds: ['E105', 'E106'], weight: 'high' }
        ],
        concerns: [],
        supportedClaims: ['E105', 'E106'],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Candidate will hit the ground running with immediate productivity in modern TypeScript stack.',
        debateQuestions: ['What is the long-term scalability ceiling of the Node/Redis session architecture?'],
        timestamp: new Date().toISOString()
      },
      skeptic: {
        agentType: 'skeptic',
        agentName: 'Arthur Pendelton',
        personaTitle: 'Chief Evaluation Skeptic & Risk Auditor',
        avatarColor: 'rose',
        recommendation: 'YES',
        confidence: 88,
        strengths: [
          { statement: 'Verified primary documents exhibit zero contradictions or GPA embellishment', evidenceIds: ['E101'], weight: 'high' },
          { statement: 'Demonstrated verifiable test automation and performance benchmarking', evidenceIds: ['E106', 'E108'], weight: 'high' }
        ],
        concerns: [
          { statement: 'Projects and internship are single-organization scope; explore architecture adaptability', evidenceIds: ['E105'], weight: 'moderate' }
        ],
        supportedClaims: ['E101', 'E106', 'E108'],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Even under rigorous adversarial audit, claims are supported by official registrar stamps and reproducible deliverables.',
        debateQuestions: ['How would you adapt the testing pipeline if migrated from Playwright to Cypress or Jest?'],
        timestamp: new Date().toISOString()
      },
      adjudicator: {
        agentType: 'adjudicator',
        agentName: 'Chief Adjudication Council',
        personaTitle: 'Adjudication Chair',
        avatarColor: 'violet',
        recommendation: 'STRONG_YES',
        confidence: 94,
        strengths: [],
        concerns: [],
        supportedClaims: [],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Unanimous high consensus.',
        debateQuestions: [],
        timestamp: new Date().toISOString()
      }
    },
    disputes: [
      {
        id: 'DISPUTE-101',
        topic: 'Scope of Junior Experience vs. Senior System Ownership',
        description: 'Committee evaluates whether candidate should be slotted at entry level or accelerated mid-level given superior deliverables.',
        initiatingAgent: 'hiring_manager',
        opposingAgent: 'skeptic',
        tensionLevel: 'low',
        coreEvidenceIds: ['E105', 'E108']
      }
    ],
    debateMessages: [
      {
        id: 'MSG-101',
        round: 1,
        speaker: 'hiring_manager',
        speakerName: 'David Sterling',
        respondingTo: 'skeptic',
        stance: 'defend',
        message: 'Sarah’s dossier shows rare consistency: 3.95 GPA Summa Cum Laude [E101], real-time CRDT canvas implementation [E108], and measurable 62 to 96 performance gains [E106]. I propose an expedited offer.',
        evidenceIds: ['E101', 'E106', 'E108'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'MSG-102',
        round: 1,
        speaker: 'skeptic',
        speakerName: 'Arthur Pendelton',
        respondingTo: 'hiring_manager',
        stance: 'agree',
        message: 'I have cross-audited the transcript records [E101-E104] against the code repositories [E108]. There is zero evidence fabrication, zero metric inflation, and clean testing discipline. I support the hiring verdict.',
        evidenceIds: ['E101', 'E108'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      }
    ],
    finalDecision: {
      recommendation: 'STRONG_HIRE',
      confidence: 94,
      executiveSummary: 'Unanimous Strong Hire recommendation. Sarah Chen combines verified academic mastery (3.95 GPA Summa Cum Laude) with production-ready TypeScript microservices and proven team mentorship.',
      evidenceWeightedReasoning: 'All primary claims are backed by official university records and verifiable software deliverables. Zero discrepancies or unverified statements were detected across the entire dossier.',
      strengths: [
        { statement: 'Summa Cum Laude graduate (3.95 GPA) with perfect 4.0 in Algorithms and Systems', evidenceIds: ['E101', 'E103'], weight: 'critical' },
        { statement: 'Engineered real-time CRDT canvas and microservices handling 50k sessions', evidenceIds: ['E105', 'E108'], weight: 'critical' },
        { statement: 'Measurable frontend performance optimization from Lighthouse 62 to 96', evidenceIds: ['E106'], weight: 'high' }
      ],
      concerns: [],
      resolvedDisagreements: [
        {
          disputeTopic: 'Band Slotting & Role Calibration',
          resolution: 'Panel agreed candidate should be extended an accelerated offer with high growth trajectory.',
          prevailingArgument: 'Demonstrated mastery across full stack with zero audit flags.',
          evidenceIds: ['E101', 'E108']
        }
      ],
      unresolvedDisagreements: [],
      positionRevisions: [],
      interviewQuestions: [
        {
          question: 'Can you walk through how your CRDT data structures handled concurrent offline edits in CollabBoard?',
          targetArea: 'Distributed Systems & State Synchronization',
          whyNeeded: 'To assess systems design depth for future team architecture projects',
          relatedEvidenceId: 'E108'
        }
      ],
      hiringRubricCoverage: [
        { criterion: 'Technical Architecture & Code Quality', score: 5, evidenceSupport: 'Supported by E105, E106, E108' },
        { criterion: 'Academic Foundations', score: 5, evidenceSupport: 'Supported by E101-E104' },
        { criterion: 'Collaboration & Mentorship', score: 5, evidenceSupport: 'Supported by E107' },
        { criterion: 'Integrity & Data Accuracy', score: 5, evidenceSupport: 'Zero discrepancies' }
      ],
      timestamp: new Date().toISOString()
    }
  },
  'cand-marcus-vance': {
    id: 'session-marcus-vance',
    createdAt: new Date().toISOString(),
    candidateName: 'Marcus Vance',
    roleTitle: 'Senior Cloud DevOps & Site Reliability Engineer',
    candidateProfile: SAMPLE_CANDIDATES[2].candidateProfile,
    jobDescription: SAMPLE_CANDIDATES[2].jobDescription,
    evidenceStore: SAMPLE_CANDIDATES[2].evidenceStore,
    status: 'completed',
    independentAssessments: {
      technical: {
        agentType: 'technical',
        agentName: 'Dr. Elena Rostova',
        personaTitle: 'Principal Technical Architect',
        avatarColor: 'blue',
        recommendation: 'NO',
        confidence: 85,
        strengths: [],
        concerns: [
          { statement: 'No verifiable open-source code, repository link, or architecture diagrams provided', evidenceIds: ['E204'], weight: 'critical' },
          { statement: 'Official transcript shows C- in Enterprise Systems (IS 310) and 2.74 GPA', evidenceIds: ['E201', 'E203'], weight: 'critical' }
        ],
        supportedClaims: [],
        unsupportedClaims: ['E204'],
        contradictedClaims: ['E205'],
        keyReasoning: 'The technical claims of mastering 8+ cloud platforms are unsubstantiated and contradict academic performance.',
        debateQuestions: ['Can candidate provide any verifiable client architectural artifact or IaC template?'],
        timestamp: new Date().toISOString()
      },
      hr: {
        agentType: 'hr',
        agentName: 'Marcus Vance-Cole',
        personaTitle: 'Head of People & Culture',
        avatarColor: 'emerald',
        recommendation: 'STRONG_NO',
        confidence: 90,
        strengths: [],
        concerns: [
          { statement: 'Severe intentional GPA inflation of 1.16 points (3.90 claimed vs 2.74 actual)', evidenceIds: ['E205', 'E201'], weight: 'critical' },
          { statement: 'Vague freelance assertions without named employer or client verification', evidenceIds: ['E204'], weight: 'high' }
        ],
        supportedClaims: [],
        unsupportedClaims: ['E204'],
        contradictedClaims: ['E205'],
        keyReasoning: 'Blatant resume fabrication fails fundamental integrity and ethical standards required for infrastructure roles.',
        debateQuestions: ['Why was 3.90 printed on the resume when the official transcript record is 2.74?'],
        timestamp: new Date().toISOString()
      },
      hiring_manager: {
        agentType: 'hiring_manager',
        agentName: 'David Sterling',
        personaTitle: 'Engineering Director & Hiring Lead',
        avatarColor: 'indigo',
        recommendation: 'NO',
        confidence: 86,
        strengths: [],
        concerns: [
          { statement: 'Cannot entrust production multi-region cloud infrastructure to unverified claims with integrity red flags', evidenceIds: ['E204', 'E205'], weight: 'critical' }
        ],
        supportedClaims: [],
        unsupportedClaims: ['E204'],
        contradictedClaims: ['E205'],
        keyReasoning: 'A Senior SRE role requires absolute reliability and truthfulness in post-mortems and monitoring.',
        debateQuestions: [],
        timestamp: new Date().toISOString()
      },
      skeptic: {
        agentType: 'skeptic',
        agentName: 'Arthur Pendelton',
        personaTitle: 'Chief Evaluation Skeptic & Risk Auditor',
        avatarColor: 'rose',
        recommendation: 'STRONG_NO',
        confidence: 96,
        strengths: [],
        concerns: [
          { statement: 'Contradiction C201: 1.16 point GPA fabrication (3.90 claimed vs 2.74 on transcript)', evidenceIds: ['E205', 'E201'], weight: 'critical' },
          { statement: 'Unverified $500k savings claim without named client, architecture, or timeline', evidenceIds: ['E204'], weight: 'critical' },
          { statement: 'Substandard academic rigor: C- in Enterprise Systems and B- in Cloud Computing', evidenceIds: ['E202', 'E203'], weight: 'high' }
        ],
        supportedClaims: [],
        unsupportedClaims: ['E204'],
        contradictedClaims: ['E205'],
        keyReasoning: 'Definitive rejection. The dossier exhibits pervasive embellishment and explicit document discrepancy.',
        debateQuestions: ['What specific Fortune 500 company authorized the self-claimed migration?'],
        timestamp: new Date().toISOString()
      },
      adjudicator: {
        agentType: 'adjudicator',
        agentName: 'Chief Adjudication Council',
        personaTitle: 'Adjudication Chair',
        avatarColor: 'violet',
        recommendation: 'STRONG_NO',
        confidence: 92,
        strengths: [],
        concerns: [],
        supportedClaims: [],
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: 'Unanimous rejection based on evidence verification failure.',
        debateQuestions: [],
        timestamp: new Date().toISOString()
      }
    },
    disputes: [
      {
        id: 'DISPUTE-201',
        topic: 'Resume Embellishment & Integrity Standard Violation',
        description: 'All 4 committee personas concur on critical integrity violations and lack of primary evidence.',
        initiatingAgent: 'skeptic',
        opposingAgent: 'hr',
        tensionLevel: 'high',
        coreEvidenceIds: ['E205', 'E201', 'E204']
      }
    ],
    debateMessages: [
      {
        id: 'MSG-201',
        round: 1,
        speaker: 'skeptic',
        speakerName: 'Arthur Pendelton',
        respondingTo: 'hiring_manager',
        stance: 'challenge',
        message: 'This application contains the most severe discrepancies in our pool. The candidate claimed a 3.90 GPA [E205] while the university transcript records a 2.74 [E201] with a C- in Systems [E203]. Every single "Fortune 500" claim [E204] is unverifiable.',
        evidenceIds: ['E205', 'E201', 'E203', 'E204'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'MSG-202',
        round: 1,
        speaker: 'hr',
        speakerName: 'Marcus Vance-Cole',
        respondingTo: 'skeptic',
        stance: 'agree',
        message: 'I agree completely with Arthur. Trust and transparent reporting are mandatory in SRE. Fabricating over a full grade point on a formal application is an immediate disqualifier.',
        evidenceIds: ['E205', 'E201'],
        changedPosition: false,
        timestamp: new Date().toISOString()
      }
    ],
    finalDecision: {
      recommendation: 'NO_HIRE',
      confidence: 92,
      executiveSummary: 'Unanimous Do Not Hire verdict. Marcus Vance’s dossier exhibits major factual contradictions, including a 1.16 GPA point fabrication (3.90 claimed vs 2.74 official) and unverified enterprise infrastructure claims.',
      evidenceWeightedReasoning: 'Evidence analysis revealed direct contradictions between resume claims and official registrar documents (E205 vs E201). For a Senior SRE role demanding absolute truthfulness during outages and audits, these discrepancies represent an unacceptable risk.',
      strengths: [],
      concerns: [
        { statement: 'Official Cumulative GPA of 2.74 contradicts resume claim of 3.90', evidenceIds: ['E205', 'E201'], weight: 'critical' },
        { statement: 'Zero verifiable technical repositories, architectural artifacts, or employer records', evidenceIds: ['E204'], weight: 'critical' },
        { statement: 'Below-average grades in core Systems Integration (C-) and Cloud Basics (B-)', evidenceIds: ['E203', 'E202'], weight: 'high' }
      ],
      resolvedDisagreements: [
        {
          disputeTopic: 'Candidate Authenticity Audit',
          resolution: 'Full committee consensus to reject candidate due to verified document falsification.',
          prevailingArgument: 'Direct contradiction between official registrar records and resume header.',
          evidenceIds: ['E205', 'E201']
        }
      ],
      unresolvedDisagreements: [],
      positionRevisions: [],
      interviewQuestions: [],
      hiringRubricCoverage: [
        { criterion: 'Technical Depth & Architecture', score: 1, evidenceSupport: 'Unverified claims (E204)' },
        { criterion: 'Academic Foundations', score: 2, evidenceSupport: 'Grade 2.74 (E201)' },
        { criterion: 'Integrity & Data Accuracy', score: 1, evidenceSupport: 'Severe contradiction C201' }
      ],
      timestamp: new Date().toISOString()
    }
  }
};

