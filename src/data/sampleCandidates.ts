import { CandidateProfile, JobDescription, EvidenceItem, AgentAssessment, DisputeTopic, DebateMessage, FinalDecision, CandidateEvaluationSession } from '../types';

export interface BenchmarkCandidate {
  id: string;
  name: string;
  targetRole: string;
  tagline: string;
  scenarioType: 'controversial' | 'high_performer' | 'exaggerated_claims' | 'junior_potential';
  resumeRawText: string;
  transcriptRawText: string;
  jobDescriptionRawText: string;
  candidateProfile: CandidateProfile;
  jobDescription: JobDescription;
  evidenceStore: EvidenceItem[];
  precomputedSession?: CandidateEvaluationSession;
}

export const SAMPLE_CANDIDATES: BenchmarkCandidate[] = [
  {
    id: 'cand-alex-rivera',
    name: 'Alex Rivera',
    targetRole: 'Machine Learning & Backend Engineer',
    tagline: 'High-impact personal projects vs. Academic transcript grade disparity in core Algorithms',
    scenarioType: 'controversial',
    resumeRawText: `ALEX RIVERA
alex.rivera@cs.edu | GitHub: github.com/arivera-ml | Portfolio: arivera.dev

OBJECTIVE:
Senior / Mid-level Machine Learning & Backend Engineer

EDUCATION:
B.S. in Computer Science, State University, Graduated May 2024
Reported GPA: 3.8 / 4.0

EXPERIENCE:
Software Engineering Intern | DataPulse Labs (June 2023 - August 2023)
- Architected and deployed an end-to-end real-time ML inference pipeline in Python and FastAPI, serving 120,000 daily requests.
- Integrated PostgreSQL with vector indexing (pgvector) reducing similarity search latency by 42%.
- Led sprint planning for a cross-functional sub-team of 4 engineers, presenting sprint demos to leadership.

TECHNICAL PROJECTS:
NeuralSearch Engine (Open Source)
- Built distributed vector search engine from scratch in Rust and Python with 1,200+ GitHub stars.
- Implemented HNSW graph indexing algorithm with sub-10ms query execution across 2M document vectors.
- Automated CI/CD pipeline using Docker and GitHub Actions for continuous benchmark regression testing.

SKILLS:
- Languages: Python (Expert), Rust (Proficient), SQL (Advanced), TypeScript (Familiar)
- ML & Frameworks: PyTorch, FastAPI, Docker, PostgreSQL, Redis, Kubernetes
- Practices: Microservices, Distributed Systems, TDD, Agile Sprint Leadership`,

    transcriptRawText: `OFFICIAL ACADEMIC TRANSCRIPT
State University — Office of the Registrar
Student Name: Alex Rivera
Student ID: CS-2020-88412
Degree Conferred: Bachelor of Science in Computer Science, May 2024

CUMULATIVE GPA: 3.42 / 4.00

COURSEWORK & GRADES:
- CS 101: Introduction to Programming (Python) — Grade: A (4.0)
- CS 201: Data Structures & Object Oriented Design — Grade: A- (3.7)
- CS 301: Design & Analysis of Algorithms — Grade: C+ (2.3)
- CS 340: Database Management Systems (SQL & Relational Design) — Grade: A (4.0)
- CS 410: Machine Learning & Deep Learning Foundations — Grade: A (4.0)
- CS 420: Distributed Systems Architecture — Grade: B- (2.7)
- CS 490: Senior Capstone Software Project — Grade: A (4.0)
- MATH 240: Linear Algebra & Matrix Computing — Grade: A (4.0)
- MATH 310: Probability & Statistics for Engineers — Grade: B+ (3.3)`,

    jobDescriptionRawText: `JOB TITLE: Machine Learning & Backend Engineer
DEPARTMENT: Core AI Infrastructure
EXPERIENCE LEVEL: Mid / Early Senior

ABOUT THE ROLE:
We are seeking a high-caliber ML & Backend Engineer to build high-throughput data processing pipelines, vector search infrastructure, and production inference microservices.

REQUIREMENTS:
- 1+ years experience or rigorous project history building scalable backend APIs in Python (FastAPI/Flask) or Rust.
- Strong practical knowledge of relational databases (PostgreSQL) and distributed caching.
- Demonstrated experience deploying ML models to production with Docker & CI/CD.
- Solid theoretical foundation in algorithms, complexity analysis, and distributed systems.
- Demonstrated ability to collaborate in cross-functional engineering teams.

PREFERRED:
- Contributions to open-source systems software.
- Experience with vector databases and embeddings.
- Track record of technical initiative or team mentoring.`,

    candidateProfile: {
      id: 'cand-alex-rivera',
      name: 'Alex Rivera',
      targetRole: 'Machine Learning & Backend Engineer',
      summary: 'Computer Science graduate with strong open-source project portfolio in vector search and hands-on ML inference intern experience, presenting an intriguing contrast with theoretical algorithm coursework grades.',
      education: [
        {
          institution: 'State University',
          degree: 'Bachelor of Science',
          major: 'Computer Science',
          gpa: '3.42 (Official) vs 3.8 (Resume Claim)',
          graduationYear: '2024',
          evidenceId: 'E001'
        }
      ],
      courses: [
        { courseName: 'Machine Learning & Deep Learning', grade: 'A (4.0)', semester: 'Fall 2023', evidenceId: 'E002' },
        { courseName: 'Database Management Systems', grade: 'A (4.0)', semester: 'Spring 2023', evidenceId: 'E003' },
        { courseName: 'Design & Analysis of Algorithms', grade: 'C+ (2.3)', semester: 'Fall 2022', evidenceId: 'E004' },
        { courseName: 'Distributed Systems Architecture', grade: 'B- (2.7)', semester: 'Spring 2024', evidenceId: 'E005' },
        { courseName: 'Linear Algebra & Matrix Computing', grade: 'A (4.0)', semester: 'Spring 2022', evidenceId: 'E006' }
      ],
      skills: [
        { name: 'Python', category: 'technical', levelClaimed: 'expert', evidenceIds: ['E007', 'E008'], isVerifiedByProjectOrCourse: true },
        { name: 'Rust', category: 'technical', levelClaimed: 'proficient', evidenceIds: ['E009'], isVerifiedByProjectOrCourse: true },
        { name: 'PostgreSQL / SQL', category: 'technical', levelClaimed: 'advanced', evidenceIds: ['E003', 'E008'], isVerifiedByProjectOrCourse: true },
        { name: 'FastAPI / REST', category: 'technical', levelClaimed: 'proficient', evidenceIds: ['E008'], isVerifiedByProjectOrCourse: true },
        { name: 'Vector Search / HNSW', category: 'technical', levelClaimed: 'proficient', evidenceIds: ['E009'], isVerifiedByProjectOrCourse: true },
        { name: 'Team Sprint Leadership', category: 'soft', levelClaimed: 'proficient', evidenceIds: ['E010'], isVerifiedByProjectOrCourse: false }
      ],
      experience: [
        {
          company: 'DataPulse Labs',
          role: 'Software Engineering Intern',
          duration: 'June 2023 - August 2023 (3 months)',
          responsibilities: [
            'Architected and deployed real-time ML inference pipeline in Python/FastAPI serving 120k requests/day',
            'Integrated PostgreSQL with pgvector reducing similarity search latency by 42%',
            'Led sprint planning for 4 engineers and presented sprint demos to leadership'
          ],
          evidenceIds: ['E008', 'E010']
        }
      ],
      projects: [
        {
          title: 'NeuralSearch Engine (Open Source)',
          technologies: ['Rust', 'Python', 'HNSW', 'Docker', 'GitHub Actions'],
          description: 'Distributed vector search engine with 1,200+ GitHub stars, implementing HNSW graph indexing algorithm with sub-10ms latency across 2M document vectors.',
          evidenceIds: ['E009', 'E011']
        }
      ],
      claims: [
        { id: 'CLM-01', statement: 'Resume states GPA is 3.8 / 4.0', evidenceId: 'E012', verificationStatus: 'contradicted' },
        { id: 'CLM-02', statement: 'Led sprint planning for a team of 4 engineers during 3-month internship', evidenceId: 'E010', verificationStatus: 'partially_supported' },
        { id: 'CLM-03', statement: 'Rust vector search engine achieves sub-10ms query execution across 2M vectors', evidenceId: 'E009', verificationStatus: 'verified' }
      ],
      contradictions: [
        {
          id: 'C001',
          topic: 'Academic GPA Discrepancy',
          resumeClaim: 'GPA: 3.8 / 4.0 on resume header',
          resumeEvidenceId: 'E012',
          transcriptFact: 'Official Cumulative GPA is 3.42 / 4.00 on university transcript',
          transcriptEvidenceId: 'E001',
          severity: 'high',
          explanation: 'The resume inflates the cumulative GPA from 3.42 to 3.80. While major-specific CS coursework in ML and Databases is high (4.0), overall cumulative GPA representation is misleading.'
        },
        {
          id: 'C002',
          topic: 'Theoretical Foundations vs. Complex Project Implementation',
          resumeClaim: 'Claims deep mastery of distributed systems and algorithmic optimization',
          resumeEvidenceId: 'E009',
          transcriptFact: 'Received C+ in Algorithms (CS 301) and B- in Distributed Systems (CS 420)',
          transcriptEvidenceId: 'E004',
          severity: 'medium',
          explanation: 'Candidate achieved exceptional practical results in self-directed Rust HNSW projects, yet struggled with theoretical proof and examination coursework in foundational Algorithms.'
        }
      ]
    },

    jobDescription: {
      id: 'jd-ml-backend',
      title: 'Machine Learning & Backend Engineer',
      department: 'Core AI Infrastructure',
      experienceLevel: 'mid',
      overview: 'Building high-throughput data processing pipelines, vector search infrastructure, and production inference microservices.',
      requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Distributed Systems Basics', 'Algorithms Foundation'],
      preferredSkills: ['Rust', 'Vector Search / Embeddings', 'CI/CD', 'Open Source Contributions'],
      educationRequirements: ['B.S. in Computer Science or equivalent technical field'],
      responsibilities: [
        'Deploy scalable backend APIs for real-time model inference',
        'Optimize vector database indexes and query latency',
        'Participate in code reviews and cross-functional agile sprints'
      ],
      technicalRequirements: ['Production API experience', 'Relational database query optimization', 'Containerization'],
      softSkillRequirements: ['Collaborative communication', 'Proactive problem solving', 'Honesty & integrity in reporting']
    },

    evidenceStore: [
      { id: 'E001', source: 'transcript.pdf', pageOrSection: 'Header', text: 'CUMULATIVE GPA: 3.42 / 4.00, Degree Conferred: May 2024', type: 'education_fact', confidence: 1.0 },
      { id: 'E002', source: 'transcript.pdf', pageOrSection: 'Course Records', text: 'CS 410: Machine Learning & Deep Learning Foundations — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E003', source: 'transcript.pdf', pageOrSection: 'Course Records', text: 'CS 340: Database Management Systems (SQL & Relational Design) — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E004', source: 'transcript.pdf', pageOrSection: 'Course Records', text: 'CS 301: Design & Analysis of Algorithms — Grade: C+ (2.3)', type: 'grade', confidence: 1.0 },
      { id: 'E005', source: 'transcript.pdf', pageOrSection: 'Course Records', text: 'CS 420: Distributed Systems Architecture — Grade: B- (2.7)', type: 'grade', confidence: 1.0 },
      { id: 'E006', source: 'transcript.pdf', pageOrSection: 'Course Records', text: 'MATH 240: Linear Algebra & Matrix Computing — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E007', source: 'resume.pdf', pageOrSection: 'Skills Section', text: 'Languages: Python (Expert), Rust (Proficient), SQL (Advanced)', type: 'technical_claim', confidence: 0.9 },
      { id: 'E008', source: 'resume.pdf', pageOrSection: 'Experience: DataPulse Labs', text: 'Architected and deployed an end-to-end real-time ML inference pipeline in Python and FastAPI, serving 120,000 daily requests. Integrated PostgreSQL with vector indexing (pgvector) reducing latency by 42%.', type: 'experience', confidence: 0.95 },
      { id: 'E009', source: 'resume.pdf', pageOrSection: 'Projects: NeuralSearch', text: 'Built distributed vector search engine from scratch in Rust and Python with 1,200+ GitHub stars. Implemented HNSW graph indexing algorithm with sub-10ms query execution across 2M document vectors.', type: 'project', confidence: 0.95 },
      { id: 'E010', source: 'resume.pdf', pageOrSection: 'Experience: DataPulse Labs', text: 'Led sprint planning for a cross-functional sub-team of 4 engineers, presenting sprint demos to leadership.', type: 'behavioral', confidence: 0.7 },
      { id: 'E011', source: 'resume.pdf', pageOrSection: 'Projects: NeuralSearch', text: 'Automated CI/CD pipeline using Docker and GitHub Actions for continuous benchmark regression testing.', type: 'project', confidence: 0.9 },
      { id: 'E012', source: 'resume.pdf', pageOrSection: 'Education Section', text: 'B.S. in Computer Science, State University, Reported GPA: 3.8 / 4.0', type: 'contradiction', confidence: 1.0 }
    ]
  },
  {
    id: 'cand-sarah-chen',
    name: 'Sarah Chen',
    targetRole: 'Full Stack Software Engineer',
    tagline: 'High Academic Performer (3.95 GPA) with verified React & Node systems, strong leadership record',
    scenarioType: 'high_performer',
    resumeRawText: `SARAH CHEN
sarah.chen@tech.edu | GitHub: github.com/sarahchen-dev | LinkedIn: linkedin.com/in/sarahchen

EDUCATION:
B.S. in Software Engineering, Institute of Technology, Graduated Dec 2023
GPA: 3.95 / 4.00 (Summa Cum Laude)

EXPERIENCE:
Full Stack Engineering Intern | CloudNova Solutions (Jan 2023 - Aug 2023)
- Built user management microservice in TypeScript, Node.js, and Redis handling 50k active sessions.
- Redesigned core analytics dashboard in React & Tailwind CSS, improving Lighthouse performance from 62 to 96.
- Mentored 2 incoming freshman interns and organized weekly engineering lunch-and-learns.

TECHNICAL PROJECTS:
CollabBoard (Live Collaborative Whiteboard)
- Engineered WebSocket-based real-time canvas with conflict-free replicated data types (CRDTs).
- Implemented role-based access control and automated end-to-end tests using Playwright.

SKILLS:
- Languages: TypeScript, JavaScript, Python, SQL
- Frameworks: React, Node.js, Express, Next.js, Tailwind CSS, Redis, PostgreSQL`,

    transcriptRawText: `OFFICIAL ACADEMIC TRANSCRIPT
Institute of Technology
Student: Sarah Chen | ID: SE-2019-4410
Degree: B.S. in Software Engineering, Dec 2023
CUMULATIVE GPA: 3.95 / 4.00 (Summa Cum Laude)

NOTABLE GRADES:
- CS 108: Web Architecture & Systems — A (4.0)
- CS 210: Data Structures & Algorithms — A (4.0)
- CS 330: Database Systems & Cloud DBs — A (4.0)
- CS 380: Software Testing & Quality Assurance — A (4.0)
- CS 492: Capstone Project (CollabBoard) — A (4.0)`,

    jobDescriptionRawText: `JOB TITLE: Full Stack Software Engineer
DEPARTMENT: Product Engineering
REQUIREMENTS:
- Strong proficiency in TypeScript, React, and Node.js.
- Experience with relational and caching databases (PostgreSQL, Redis).
- Proven track record of clean code, automated testing, and collaborative teamwork.
- B.S. in Computer Science or Software Engineering.`,

    candidateProfile: {
      id: 'cand-sarah-chen',
      name: 'Sarah Chen',
      targetRole: 'Full Stack Software Engineer',
      summary: 'Consistent high performer with near-perfect academic record (3.95 GPA), verified frontend performance optimization and collaborative CRDT whiteboard architecture.',
      education: [
        {
          institution: 'Institute of Technology',
          degree: 'B.S. in Software Engineering',
          major: 'Software Engineering',
          gpa: '3.95 / 4.00',
          graduationYear: '2023',
          evidenceId: 'E101'
        }
      ],
      courses: [
        { courseName: 'Web Architecture & Systems', grade: 'A (4.0)', evidenceId: 'E102' },
        { courseName: 'Data Structures & Algorithms', grade: 'A (4.0)', evidenceId: 'E103' },
        { courseName: 'Software Testing & QA', grade: 'A (4.0)', evidenceId: 'E104' }
      ],
      skills: [
        { name: 'TypeScript', category: 'technical', levelClaimed: 'advanced', evidenceIds: ['E105', 'E106'], isVerifiedByProjectOrCourse: true },
        { name: 'React & Tailwind', category: 'technical', levelClaimed: 'advanced', evidenceIds: ['E106'], isVerifiedByProjectOrCourse: true },
        { name: 'Node.js & Redis', category: 'technical', levelClaimed: 'proficient', evidenceIds: ['E105'], isVerifiedByProjectOrCourse: true },
        { name: 'Mentorship & Collaboration', category: 'soft', levelClaimed: 'proficient', evidenceIds: ['E107'], isVerifiedByProjectOrCourse: true }
      ],
      experience: [
        {
          company: 'CloudNova Solutions',
          role: 'Full Stack Engineering Intern',
          duration: 'Jan 2023 - Aug 2023 (8 months)',
          responsibilities: [
            'Built user management microservice in TypeScript/Node.js/Redis for 50k sessions',
            'Optimized React dashboard improving Lighthouse from 62 to 96',
            'Mentored 2 interns and hosted technical sessions'
          ],
          evidenceIds: ['E105', 'E106', 'E107']
        }
      ],
      projects: [
        {
          title: 'CollabBoard',
          technologies: ['TypeScript', 'React', 'WebSockets', 'CRDTs', 'Playwright'],
          description: 'Real-time collaborative canvas utilizing CRDTs with automated E2E tests.',
          evidenceIds: ['E108']
        }
      ],
      claims: [
        { id: 'CLM-101', statement: 'Lighthouse score improved from 62 to 96', evidenceId: 'E106', verificationStatus: 'verified' },
        { id: 'CLM-102', statement: 'Summa Cum Laude with 3.95 cumulative GPA', evidenceId: 'E101', verificationStatus: 'verified' }
      ],
      contradictions: []
    },

    jobDescription: {
      id: 'jd-fullstack',
      title: 'Full Stack Software Engineer',
      department: 'Product Engineering',
      experienceLevel: 'junior',
      overview: 'Building responsive web interfaces and resilient API microservices.',
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Testing'],
      preferredSkills: ['Redis', 'WebSockets', 'Tailwind CSS'],
      educationRequirements: ['B.S. in Computer Science or Software Engineering'],
      responsibilities: ['Develop new product features', 'Write unit & E2E tests', 'Collaborate across UX and Product'],
      technicalRequirements: ['Modern JavaScript/TypeScript', 'State management', 'REST/WebSockets'],
      softSkillRequirements: ['Mentorship potential', 'Clear technical writing']
    },

    evidenceStore: [
      { id: 'E101', source: 'transcript.pdf', pageOrSection: 'Header', text: 'CUMULATIVE GPA: 3.95 / 4.00 (Summa Cum Laude), Conferred Dec 2023', type: 'education_fact', confidence: 1.0 },
      { id: 'E102', source: 'transcript.pdf', pageOrSection: 'Courses', text: 'CS 108: Web Architecture & Systems — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E103', source: 'transcript.pdf', pageOrSection: 'Courses', text: 'CS 210: Data Structures & Algorithms — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E104', source: 'transcript.pdf', pageOrSection: 'Courses', text: 'CS 380: Software Testing & Quality Assurance — Grade: A (4.0)', type: 'grade', confidence: 1.0 },
      { id: 'E105', source: 'resume.pdf', pageOrSection: 'Experience: CloudNova', text: 'Built user management microservice in TypeScript, Node.js, and Redis handling 50k active sessions.', type: 'experience', confidence: 0.95 },
      { id: 'E106', source: 'resume.pdf', pageOrSection: 'Experience: CloudNova', text: 'Redesigned core analytics dashboard in React & Tailwind CSS, improving Lighthouse performance from 62 to 96.', type: 'experience', confidence: 0.95 },
      { id: 'E107', source: 'resume.pdf', pageOrSection: 'Experience: CloudNova', text: 'Mentored 2 incoming freshman interns and organized weekly engineering lunch-and-learns.', type: 'behavioral', confidence: 0.9 },
      { id: 'E108', source: 'resume.pdf', pageOrSection: 'Projects', text: 'CollabBoard: Engineered WebSocket-based real-time canvas with CRDTs and Playwright automated tests.', type: 'project', confidence: 0.95 }
    ]
  },
  {
    id: 'cand-marcus-vance',
    name: 'Marcus Vance',
    targetRole: 'Senior Cloud DevOps & Site Reliability Engineer',
    tagline: 'Inflated buzzwords & unverified enterprise claims vs. Minimal documented coursework/evidence',
    scenarioType: 'exaggerated_claims',
    resumeRawText: `MARCUS VANCE
marcus.vance@devops.net | GitHub: github.com/mvance-ops

SUMMARY:
Elite Cloud Architect & Kubernetes Master with 10+ years of self-driven multi-cloud experience across AWS, GCP, and Azure. Single-handedly saved $500k in annual cloud infrastructure costs.

EXPERIENCE:
Principal Cloud Consultant | Freelance / Self-Employed (2022 - Present)
- Masterminded global multi-region multi-cloud Kubernetes cluster for Fortune 500 financial clients.
- Automated zero-downtime microservice migration with 99.999% SLA reliability.
- Led company-wide DevSecOps transformation.

EDUCATION:
B.S. in Information Systems, Metropolitan College, 2021
GPA: 3.90

SKILLS:
Kubernetes (Master), Terraform (Master), AWS (Master), GCP (Master), Docker, Prometheus, Helm, Istio, Python, Go`,

    transcriptRawText: `METROPOLITAN COLLEGE — STUDENT RECORD
Student: Marcus Vance | ID: IS-9938
Degree: Bachelor of Science in Information Systems, Completed Dec 2021
CUMULATIVE GPA: 2.74 / 4.00

RECORDED COURSES:
- IS 100: Intro to Information Systems — B (3.0)
- IS 220: Networking Fundamentals — C (2.0)
- IS 310: Enterprise Systems Integration — C- (1.7)
- IS 405: Cloud Computing Basics (AWS Academy) — B- (2.7)`,

    jobDescriptionRawText: `JOB TITLE: Senior Cloud DevOps & Site Reliability Engineer
DEPARTMENT: Infrastructure
REQUIREMENTS:
- 4+ years proven experience in enterprise Kubernetes, Terraform, and AWS/GCP.
- Demonstrable architecture design and incident management track record.
- Verifiable client references or team experience.`,

    candidateProfile: {
      id: 'cand-marcus-vance',
      name: 'Marcus Vance',
      targetRole: 'Senior Cloud DevOps & Site Reliability Engineer',
      summary: 'Resume claims enterprise Fortune 500 consulting, $500k savings, and "Master" level across 8 disparate cloud technologies, which directly conflicts with transcript records and lacks verifiable production evidence.',
      education: [
        {
          institution: 'Metropolitan College',
          degree: 'B.S. in Information Systems',
          major: 'Information Systems',
          gpa: '2.74 (Official) vs 3.90 (Claimed)',
          graduationYear: '2021',
          evidenceId: 'E201'
        }
      ],
      courses: [
        { courseName: 'Cloud Computing Basics', grade: 'B- (2.7)', evidenceId: 'E202' },
        { courseName: 'Enterprise Systems Integration', grade: 'C- (1.7)', evidenceId: 'E203' }
      ],
      skills: [
        { name: 'Kubernetes', category: 'technical', levelClaimed: 'expert', evidenceIds: ['E204'], isVerifiedByProjectOrCourse: false },
        { name: 'Terraform & AWS', category: 'technical', levelClaimed: 'expert', evidenceIds: ['E204'], isVerifiedByProjectOrCourse: false }
      ],
      experience: [
        {
          company: 'Self-Employed Freelance',
          role: 'Principal Cloud Consultant',
          duration: '2022 - Present',
          responsibilities: [
            'Claims global Fortune 500 multi-region Kubernetes migration',
            'Claims $500k annual cloud savings with zero verifiable employer citations'
          ],
          evidenceIds: ['E204']
        }
      ],
      projects: [],
      claims: [
        { id: 'CLM-201', statement: 'Resume claims GPA 3.90 (Actual 2.74)', evidenceId: 'E205', verificationStatus: 'contradicted' },
        { id: 'CLM-202', statement: 'Single-handedly saved $500k for Fortune 500 clients without naming client or architectural specifics', evidenceId: 'E204', verificationStatus: 'unsupported' }
      ],
      contradictions: [
        {
          id: 'C201',
          topic: 'GPA and Academic Rigor Mismatch',
          resumeClaim: 'GPA: 3.90 on resume',
          resumeEvidenceId: 'E205',
          transcriptFact: 'Official GPA is 2.74 with C- in Enterprise Systems',
          transcriptEvidenceId: 'E201',
          severity: 'high',
          explanation: 'Severe resume embellishment of 1.16 GPA points, combined with low grades in core systems subjects.'
        }
      ]
    },

    jobDescription: {
      id: 'jd-sre',
      title: 'Senior Cloud DevOps & Site Reliability Engineer',
      department: 'Infrastructure',
      experienceLevel: 'senior',
      overview: 'Managing production multi-cluster Kubernetes and cloud infrastructure.',
      requiredSkills: ['Kubernetes', 'Terraform', 'AWS', 'SRE Practices'],
      preferredSkills: ['Prometheus', 'Helm', 'Golang'],
      educationRequirements: ['B.S. in Computer Science, IS, or equivalent'],
      responsibilities: ['Ensure 99.99% uptime', 'Automate cloud provisioning', 'Lead post-mortems'],
      technicalRequirements: ['Production enterprise Kubernetes', 'Infrastructure as Code'],
      softSkillRequirements: ['Transparent communication', 'Honest incident reporting']
    },

    evidenceStore: [
      { id: 'E201', source: 'transcript.pdf', pageOrSection: 'Header', text: 'CUMULATIVE GPA: 2.74 / 4.00, Degree: B.S. in Information Systems, Completed Dec 2021', type: 'education_fact', confidence: 1.0 },
      { id: 'E202', source: 'transcript.pdf', pageOrSection: 'Courses', text: 'IS 405: Cloud Computing Basics — Grade: B- (2.7)', type: 'grade', confidence: 1.0 },
      { id: 'E203', source: 'transcript.pdf', pageOrSection: 'Courses', text: 'IS 310: Enterprise Systems Integration — Grade: C- (1.7)', type: 'grade', confidence: 1.0 },
      { id: 'E204', source: 'resume.pdf', pageOrSection: 'Experience', text: 'Masterminded global multi-region multi-cloud Kubernetes cluster for Fortune 500 financial clients. Saved $500k annually.', type: 'technical_claim', confidence: 0.3 },
      { id: 'E205', source: 'resume.pdf', pageOrSection: 'Education', text: 'B.S. in Information Systems, 2021, GPA: 3.90', type: 'contradiction', confidence: 1.0 }
    ]
  }
];
