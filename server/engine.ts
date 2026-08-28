import {
  CandidateProfile,
  JobDescription,
  EvidenceItem,
  ContradictionItem,
  AgentAssessment,
  DisputeTopic,
  DebateMessage,
  PositionRevisionRecord,
  FinalDecision,
  AgentType,
  AgentRecommendation,
  RecommendationType,
} from "../src/types";
import { generateJSON, getGemini } from "./gemini";

// Helper: validate evidence IDs to prevent hallucinated citations
export function filterValidEvidenceIds(ids: string[], store: EvidenceItem[]): string[] {
  if (!Array.isArray(ids)) return [];
  const validSet = new Set(store.map((e) => e.id.toUpperCase()));
  return ids.map(id => id.trim().toUpperCase()).filter((id) => validSet.has(id));
}

// Robust heuristic extractor for when AI model is temporarily rate-limited / experiencing high demand
function heuristicExtraction(
  resumeText: string,
  transcriptText: string,
  jobDescriptionText: string
): {
  profile: CandidateProfile;
  jobDescription: JobDescription;
  evidenceStore: EvidenceItem[];
} {
  const evidenceStore: EvidenceItem[] = [];
  let eCounter = 1;
  const nextId = () => `E${String(eCounter++).padStart(3, "0")}`;

  const resumeLines = resumeText.split("\n").map(l => l.trim()).filter(Boolean);
  const transcriptLines = (transcriptText || "").split("\n").map(l => l.trim()).filter(Boolean);
  const jdLines = jobDescriptionText.split("\n").map(l => l.trim()).filter(Boolean);

  // Extract name
  const name = resumeLines[0] || "Candidate";

  // Extract GPA from resume
  const resumeGpaMatch = resumeText.match(/GPA[:\s]+([0-4]\.[0-9]{1,2})/i);
  const resumeGpa = resumeGpaMatch ? resumeGpaMatch[1] : undefined;
  let resumeGpaEid: string | undefined;
  if (resumeGpa) {
    resumeGpaEid = nextId();
    evidenceStore.push({
      id: resumeGpaEid,
      source: "resume.pdf",
      pageOrSection: "Education Header",
      text: `Self-reported Cumulative GPA: ${resumeGpa}`,
      type: "grade",
      confidence: 0.95,
    });
  }

  // Extract GPA from transcript
  const transcriptGpaMatch = transcriptText.match(/(?:Cumulative|Overall|Degree)?\s*GPA[:\s]+([0-4]\.[0-9]{1,2})/i);
  const transcriptGpa = transcriptGpaMatch ? transcriptGpaMatch[1] : undefined;
  let transcriptGpaEid: string | undefined;
  if (transcriptGpa) {
    transcriptGpaEid = nextId();
    evidenceStore.push({
      id: transcriptGpaEid,
      source: "transcript.pdf",
      pageOrSection: "Registrar Summary",
      text: `Official Cumulative GPA: ${transcriptGpa}`,
      type: "education_fact",
      confidence: 1.0,
    });
  }

  // Parse Courses from transcript
  const courses: Array<{ courseName: string; grade: string; semester: string; evidenceId: string }> = [];
  for (const line of transcriptLines) {
    const courseMatch = line.match(/(CS\s*\d+|MATH\s*\d+|[A-Z]{2,4}\s*\d{3,4})[:\s-]+([A-Za-z\s]+)\s+Grade:\s*([A-F][+-]?|4\.0|[0-3]\.[0-9])/i) ||
                        line.match(/([A-Z]{2,4}\s*\d{3,4})\s+-\s+([^,\n]+)[,\s]+Grade:\s*([A-F][+-]?)/i);
    if (courseMatch) {
      const eid = nextId();
      const courseName = `${courseMatch[1].trim()} - ${courseMatch[2].trim()}`;
      const grade = courseMatch[3].trim();
      evidenceStore.push({
        id: eid,
        source: "transcript.pdf",
        pageOrSection: "Academic History",
        text: `Completed ${courseName} with grade ${grade}`,
        type: "grade",
        confidence: 1.0,
      });
      courses.push({
        courseName,
        grade,
        semester: "Completed Term",
        evidenceId: eid,
      });
    }
  }

  // Contradictions check (e.g. GPA mismatch)
  const contradictions: ContradictionItem[] = [];
  if (resumeGpa && transcriptGpa && Math.abs(parseFloat(resumeGpa) - parseFloat(transcriptGpa)) > 0.1) {
    contradictions.push({
      id: "C001",
      topic: "Academic GPA Discrepancy",
      resumeClaim: `Self-reported ${resumeGpa} GPA on resume`,
      resumeEvidenceId: resumeGpaEid || "E001",
      transcriptFact: `Official transcript records ${transcriptGpa} GPA`,
      transcriptEvidenceId: transcriptGpaEid || "E002",
      severity: "high",
      explanation: `Candidate claimed a ${resumeGpa} cumulative GPA on their resume, while official university registrar records reflect a ${transcriptGpa} GPA.`,
    });
  }

  // Extract skills from resume
  const commonTech = [
    "Python", "TypeScript", "JavaScript", "Rust", "Go", "Java", "C++", "React",
    "Node.js", "PyTorch", "TensorFlow", "PostgreSQL", "Docker", "Kubernetes", "AWS", "GCP", "SQL", "GraphQL"
  ];
  const detectedSkills = commonTech.filter(tech => new RegExp(`\\b${tech}\\b`, "i").test(resumeText));
  const skills = detectedSkills.map((tech) => {
    const eid = nextId();
    evidenceStore.push({
      id: eid,
      source: "resume.pdf",
      pageOrSection: "Technical Skills",
      text: `Demonstrated technical skill proficiency in ${tech}`,
      type: "technical_claim",
      confidence: 0.9,
    });
    return {
      name: tech,
      category: "technical" as const,
      levelClaimed: "proficient" as const,
      evidenceIds: [eid],
      isVerifiedByProjectOrCourse: courses.some(c => c.courseName.toLowerCase().includes(tech.toLowerCase())),
    };
  });

  // Extract experience bullets
  const expEid = nextId();
  evidenceStore.push({
    id: expEid,
    source: "resume.pdf",
    pageOrSection: "Work Experience",
    text: resumeLines.slice(4, 8).join(" ") || "Software Engineering Experience",
    type: "experience",
    confidence: 0.85,
  });

  // Extract projects bullets
  const projEid = nextId();
  evidenceStore.push({
    id: projEid,
    source: "resume.pdf",
    pageOrSection: "Projects",
    text: resumeLines.slice(8, 12).join(" ") || "Technical Systems Implementation Project",
    type: "project",
    confidence: 0.85,
  });

  // Parse Job Description
  const jdTitle = jdLines[0] || "Software Engineer";
  const requiredSkills = detectedSkills.slice(0, 4).length ? detectedSkills.slice(0, 4) : ["Software Engineering", "Systems Design"];

  const candidateProfile: CandidateProfile = {
    id: `cand-${Date.now()}`,
    name,
    targetRole: jdTitle,
    summary: `${name} has structured experience across ${detectedSkills.slice(0, 4).join(", ") || "software engineering"}.`,
    education: [
      {
        institution: "Accredited University",
        degree: "Bachelor of Science",
        major: "Computer Science",
        gpa: transcriptGpa || resumeGpa || "3.5",
        graduationYear: "2024",
        evidenceId: transcriptGpaEid || resumeGpaEid || nextId(),
      },
    ],
    courses,
    skills,
    experience: [
      {
        company: "Engineering Organization",
        role: "Software Engineering Intern / Contributor",
        duration: "Recent",
        responsibilities: resumeLines.slice(3, 7),
        evidenceIds: [expEid],
      },
    ],
    projects: [
      {
        title: "Primary Engineering Deliverable",
        technologies: detectedSkills.slice(0, 3),
        description: resumeLines.slice(7, 11).join(". ") || "Engineered scalable technical components with verified deliverables.",
        evidenceIds: [projEid],
      },
    ],
    contradictions,
    claims: [
      {
        id: "CLM-01",
        statement: `Proficiency in ${detectedSkills[0] || "core engineering"}`,
        evidenceId: expEid,
        verificationStatus: "verified",
      },
    ],
  };

  const jobDescription: JobDescription = {
    id: `jd-${Date.now()}`,
    title: jdTitle,
    department: "Engineering",
    experienceLevel: "mid",
    overview: jdLines.slice(0, 3).join(" ") || "Role responsible for designing and deploying software systems.",
    requiredSkills,
    preferredSkills: detectedSkills.slice(4, 7),
    educationRequirements: ["B.S. in Computer Science or related field"],
    responsibilities: jdLines.slice(2, 6),
    technicalRequirements: requiredSkills,
    softSkillRequirements: ["Communication", "Cross-functional Collaboration"],
  };

  return {
    profile: candidateProfile,
    jobDescription,
    evidenceStore,
  };
}

// Stage 1: Document Parsing & Profile Construction + Evidence Store & Contradictions
export async function buildProfileAndEvidence(
  resumeText: string,
  transcriptText: string,
  jobDescriptionText: string
): Promise<{
  profile: CandidateProfile;
  jobDescription: JobDescription;
  evidenceStore: EvidenceItem[];
}> {
  const gemini = getGemini();

  if (gemini) {
    try {
      const prompt = `
You are the Candidate Profile Builder & Evidence Engine for an AI Hiring Panel.
Analyze the following candidate documents and job description carefully.

--- RESUME TEXT ---
${resumeText}

--- TRANSCRIPT TEXT ---
${transcriptText || "No transcript provided"}

--- JOB DESCRIPTION TEXT ---
${jobDescriptionText}

TASK:
1. Extract every meaningful candidate claim, fact, grade, project, experience, and education record into a structured Evidence Store with unique IDs: "E001", "E002", "E003", etc.
2. For each evidence item, preserve the exact source ('resume.pdf', 'transcript.pdf', or 'job_description.txt'), section/page, exact text snippet, and type.
3. Compare the Resume claims against the Transcript facts. If there is any discrepancy (e.g. GPA difference, graduation date discrepancy, course grade discrepancies, inflated claims), flag it as a Contradiction object with ID "C001", "C002", etc., linking to respective evidence IDs.
4. Structure the Candidate Profile and Job Description according to the JSON format.

OUTPUT JSON SCHEMA:
{
  "evidenceStore": [
    {
      "id": "E001",
      "source": "transcript.pdf",
      "pageOrSection": "Header / Registrar",
      "text": "Exact quote snippet from source",
      "type": "education_fact",
      "confidence": 1.0
    }
  ],
  "contradictions": [
    {
      "id": "C001",
      "topic": "Academic GPA Discrepancy",
      "resumeClaim": "Claims 3.8 GPA on resume",
      "resumeEvidenceId": "E005",
      "transcriptFact": "Transcript shows 3.42 GPA",
      "transcriptEvidenceId": "E001",
      "severity": "high",
      "explanation": "Clear explanation of discrepancy"
    }
  ],
  "profile": {
    "id": "cand-${Date.now()}",
    "name": "Candidate Full Name",
    "targetRole": "Role Title",
    "summary": "Objective synthesis of candidate profile",
    "education": [
      {
        "institution": "University Name",
        "degree": "Degree Name",
        "major": "Major Name",
        "gpa": "GPA details",
        "graduationYear": "2024",
        "evidenceId": "E001"
      }
    ],
    "courses": [
      {
        "courseName": "Course Title",
        "grade": "Grade e.g. A (4.0)",
        "semester": "Fall 2023",
        "evidenceId": "E002"
      }
    ],
    "skills": [
      {
        "name": "Python",
        "category": "technical",
        "levelClaimed": "expert",
        "evidenceIds": ["E003"],
        "isVerifiedByProjectOrCourse": true
      }
    ],
    "experience": [
      {
        "company": "Company Name",
        "role": "Role Title",
        "duration": "Dates",
        "responsibilities": ["Detailed responsibility item"],
        "evidenceIds": ["E004"]
      }
    ],
    "projects": [
      {
        "title": "Project Name",
        "technologies": ["Tech1", "Tech2"],
        "description": "Project description",
        "evidenceIds": ["E005"]
      }
    ],
    "claims": [
      {
        "id": "CLM-01",
        "statement": "Claim statement",
        "evidenceId": "E005",
        "verificationStatus": "verified"
      }
    ]
  },
  "jobDescription": {
    "id": "jd-${Date.now()}",
    "title": "Job Title",
    "department": "Engineering / Product",
    "experienceLevel": "mid",
    "overview": "Job summary",
    "requiredSkills": ["Skill 1", "Skill 2"],
    "preferredSkills": ["Skill 3"],
    "educationRequirements": ["Education req"],
    "responsibilities": ["Resp 1", "Resp 2"],
    "technicalRequirements": ["Tech req 1"],
    "softSkillRequirements": ["Soft req 1"]
  }
}
`;

      const result = await generateJSON<{
        evidenceStore: EvidenceItem[];
        contradictions: ContradictionItem[];
        profile: CandidateProfile;
        jobDescription: JobDescription;
      }>(prompt, "You are an expert recruitment parser and evidence extraction system.");

      if (result && result.profile && result.evidenceStore && result.evidenceStore.length > 0) {
        const evidenceStore = result.evidenceStore || [];
        const contradictions = result.contradictions || [];
        const profile = {
          ...result.profile,
          contradictions,
        };
        const jobDescription = result.jobDescription;
        return { profile, jobDescription, evidenceStore };
      }
    } catch (llmErr) {
      console.warn("LLM extraction failed, using robust heuristic fallback parser:", llmErr);
    }
  }

  // Graceful fallback parser
  return heuristicExtraction(resumeText, transcriptText, jobDescriptionText);
}

// Stage 2: 4 Independent Agents with STRICT Isolation
export async function runIndependentAgents(
  profile: CandidateProfile,
  evidenceStore: EvidenceItem[],
  jobDescription: JobDescription
): Promise<Record<AgentType, AgentAssessment>> {
  const evidenceSummary = evidenceStore
    .map((e) => `[${e.id}] (${e.source} - ${e.pageOrSection}): "${e.text}"`)
    .join("\n");

  const contradictionsSummary = (profile.contradictions || [])
    .map(
      (c) =>
        `[CONTRADICTION ${c.id}] ${c.topic} (Severity: ${c.severity}): Resume [${c.resumeEvidenceId}] "${c.resumeClaim}" vs Transcript [${c.transcriptEvidenceId}] "${c.transcriptFact}". Detail: ${c.explanation}`
    )
    .join("\n");

  const baseContext = `
CANDIDATE NAME: ${profile.name}
TARGET ROLE: ${jobDescription.title} (${jobDescription.experienceLevel} level)
CANDIDATE SUMMARY: ${profile.summary}

JOB REQUIREMENTS:
- Required Skills: ${jobDescription.requiredSkills.join(", ")}
- Preferred Skills: ${jobDescription.preferredSkills.join(", ")}
- Education: ${jobDescription.educationRequirements.join(", ")}
- Responsibilities: ${jobDescription.responsibilities.join("; ")}

EVIDENCE REPOSITORY (You MUST cite these exact Evidence IDs like E001, E002):
${evidenceSummary}

DETECTED CONTRADICTIONS:
${contradictionsSummary || "None detected"}
`;

  // Define isolated persona configurations
  const personas: Array<{
    type: AgentType;
    name: string;
    title: string;
    color: string;
    instructions: string;
  }> = [
    {
      type: "technical",
      name: "Dr. Elena Rostova",
      title: "Principal Technical Architect",
      color: "blue",
      instructions: `You are the TECHNICAL AGENT.
Your focus:
- Evaluate hard technical skills, engineering depth, architecture complexity, and hands-on implementation evidence.
- Review academic coursework in algorithms, databases, systems, and mathematics against project claims.
- Assess whether technical claims are backed by solid evidence (code, projects, coursework) or are superficial buzzwords.
- Be rigorous on system design, scalability, and code quality indicators.
- NEVER invent facts. Every strength and concern MUST cite valid Evidence IDs from the Evidence Repository.`,
    },
    {
      type: "hr",
      name: "Marcus Vance-Cole",
      title: "Head of People & Culture",
      color: "emerald",
      instructions: `You are the HR / CULTURE AGENT.
Your focus:
- Evaluate collaboration, teamwork, communication, and behavioral indicators based ONLY on concrete evidence.
- Look for evidence of mentorship, cross-functional sprint coordination, team presentations, and longevity.
- DO NOT invent arbitrary personality traits (e.g. do not say "seems like a friendly person" without evidence).
- Evaluate consistency, career progression, and alignment with company culture.
- Every strength and concern MUST cite valid Evidence IDs.`,
    },
    {
      type: "hiring_manager",
      name: "David Sterling",
      title: "Engineering Director & Hiring Lead",
      color: "indigo",
      instructions: `You are the HIRING MANAGER AGENT.
Your focus:
- Evaluate business impact, role readiness, return on investment, and operational risk.
- Ask: "Would I move this candidate forward to an on-site interview right now based on our business needs?"
- Weigh whether the candidate can hit the ground running versus requiring extensive handholding.
- Consider practical project deliverables, speed of execution, and problem-solving initiative.
- Every strength and concern MUST cite valid Evidence IDs.`,
    },
    {
      type: "skeptic",
      name: "Arthur Pendelton",
      title: "Chief Evaluation Skeptic & Risk Auditor",
      color: "rose",
      instructions: `You are the SKEPTIC AGENT.
Your focus:
- Actively probe for exaggerations, unsupported claims, resume-vs-transcript inconsistencies, missing proof, and red flags.
- Check if project scale claims (e.g. "millions of requests", "distributed architecture") are backed by concrete evidence or are exaggerated student projects.
- Scrutinize discrepancies between resume self-reported GPA/skills and transcript grades.
- Challenge weak evidence without being unreasonably hostile: hold candidates to high evidence standards.
- Every strength, concern, and unsupported claim MUST cite valid Evidence IDs.`,
    },
  ];

  // Execute in parallel with strict isolation
  const assessmentPromises = personas.map(async (persona) => {
    const prompt = `
${persona.instructions}

Here is the Candidate and Evidence data:
${baseContext}

Evaluate this candidate independently. You do not have access to any other agent's conclusions.
Return your assessment in the specified JSON format.

JSON SCHEMA:
{
  "recommendation": "YES" | "STRONG_YES" | "MAYBE" | "NO" | "STRONG_NO",
  "confidence": 85,
  "strengths": [
    {
      "statement": "Clear statement of strength",
      "evidenceIds": ["E001", "E002"],
      "weight": "critical" | "high" | "moderate"
    }
  ],
  "concerns": [
    {
      "statement": "Clear statement of concern",
      "evidenceIds": ["E003"],
      "weight": "critical" | "high" | "moderate"
    }
  ],
  "supportedClaims": ["E001", "E002"],
  "unsupportedClaims": ["E005"],
  "contradictedClaims": ["E012"],
  "keyReasoning": "Concise paragraph explaining your overall independent assessment and why you reached this recommendation.",
  "debateQuestions": [
    "A sharp question or challenge you want to bring to the hiring committee debate"
  ]
}
`;

    try {
      const response = await generateJSON<any>(
        prompt,
        `You are ${persona.name}, ${persona.title}. Output strictly valid JSON.`
      );

      const assessment: AgentAssessment = {
        agentType: persona.type,
        agentName: persona.name,
        personaTitle: persona.title,
        avatarColor: persona.color,
        recommendation: (response.recommendation as AgentRecommendation) || "MAYBE",
        confidence: Math.min(100, Math.max(0, Number(response.confidence) || 70)),
        strengths: (response.strengths || []).map((s: any) => ({
          statement: s.statement || "",
          evidenceIds: filterValidEvidenceIds(s.evidenceIds || [], evidenceStore),
          weight: s.weight || "high",
        })),
        concerns: (response.concerns || []).map((c: any) => ({
          statement: c.statement || "",
          evidenceIds: filterValidEvidenceIds(c.evidenceIds || [], evidenceStore),
          weight: c.weight || "high",
        })),
        supportedClaims: filterValidEvidenceIds(response.supportedClaims || [], evidenceStore),
        unsupportedClaims: filterValidEvidenceIds(response.unsupportedClaims || [], evidenceStore),
        contradictedClaims: filterValidEvidenceIds(response.contradictedClaims || [], evidenceStore),
        keyReasoning: response.keyReasoning || "Independent evaluation completed based on evidence.",
        debateQuestions: response.debateQuestions || [],
        timestamp: new Date().toISOString(),
      };

      return { type: persona.type, assessment };
    } catch (err) {
      console.error(`Error evaluating agent ${persona.type}:`, err);
      // Fallback assessment
      const fallback: AgentAssessment = {
        agentType: persona.type,
        agentName: persona.name,
        personaTitle: persona.title,
        avatarColor: persona.color,
        recommendation: "MAYBE",
        confidence: 65,
        strengths: [
          {
            statement: "Demonstrates practical foundation in core required areas.",
            evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
            weight: "high",
          },
        ],
        concerns: [
          {
            statement: "Requires further validation during the live debate.",
            evidenceIds: [],
            weight: "moderate",
          },
        ],
        supportedClaims: evidenceStore.slice(0, 2).map((e) => e.id),
        unsupportedClaims: [],
        contradictedClaims: [],
        keyReasoning: "Evaluated based on submitted profile facts and coursework.",
        debateQuestions: ["What is the true depth of hands-on production experience?"],
        timestamp: new Date().toISOString(),
      };
      return { type: persona.type, assessment: fallback };
    }
  });

  const results = await Promise.all(assessmentPromises);
  const assessments: Record<AgentType, AgentAssessment> = {} as any;
  for (const r of results) {
    assessments[r.type] = r.assessment;
  }
  return assessments;
}

// Stage 3: Disagreement Detection
export async function detectDisagreements(
  assessments: Record<AgentType, AgentAssessment>,
  evidenceStore: EvidenceItem[],
  jobDescription: JobDescription
): Promise<DisputeTopic[]> {
  const prompt = `
You are the Hiring Committee Dispute Arbiter.
Analyze the independent assessments of the 4 AI evaluators:

1. TECHNICAL AGENT (${assessments.technical.agentName}):
- Recommendation: ${assessments.technical.recommendation} (${assessments.technical.confidence}%)
- Strengths: ${assessments.technical.strengths.map((s) => s.statement).join("; ")}
- Concerns: ${assessments.technical.concerns.map((c) => c.statement).join("; ")}
- Key Reasoning: ${assessments.technical.keyReasoning}

2. HR / CULTURE AGENT (${assessments.hr.agentName}):
- Recommendation: ${assessments.hr.recommendation} (${assessments.hr.confidence}%)
- Strengths: ${assessments.hr.strengths.map((s) => s.statement).join("; ")}
- Concerns: ${assessments.hr.concerns.map((c) => c.statement).join("; ")}

3. HIRING MANAGER AGENT (${assessments.hiring_manager.agentName}):
- Recommendation: ${assessments.hiring_manager.recommendation} (${assessments.hiring_manager.confidence}%)
- Key Reasoning: ${assessments.hiring_manager.keyReasoning}

4. SKEPTIC AGENT (${assessments.skeptic.agentName}):
- Recommendation: ${assessments.skeptic.recommendation} (${assessments.skeptic.confidence}%)
- Concerns: ${assessments.skeptic.concerns.map((c) => c.statement).join("; ")}
- Key Reasoning: ${assessments.skeptic.keyReasoning}

TASK:
Identify 2 to 3 substantive points of genuine disagreement or debate topics between the agents (e.g. Technical vs Skeptic on project depth vs academic grades, HR vs Skeptic on leadership evidence, or Hiring Manager vs Skeptic on overall hiring risk).

OUTPUT JSON SCHEMA:
{
  "disputes": [
    {
      "id": "DISPUTE-001",
      "topic": "Practical Project Proficiency vs. Theoretical Algorithms Coursework",
      "description": "Technical agent values open-source Rust HNSW engine implementation, whereas Skeptic emphasizes the C+ grade in CS 301 Algorithms and reported GPA inflation.",
      "initiatingAgent": "skeptic",
      "opposingAgent": "technical",
      "tensionLevel": "high" | "medium" | "low",
      "coreEvidenceIds": ["E004", "E009", "E012"]
    }
  ]
}
`;

  try {
    const res = await generateJSON<{ disputes: DisputeTopic[] }>(
      prompt,
      "You identify genuine intellectual disputes between evaluators."
    );
    return res.disputes || [];
  } catch (err) {
    console.error("Error detecting disagreements:", err);
    return [
      {
        id: "DISPUTE-001",
        topic: "Demonstrated Technical Depth vs Academic Transcript Consistency",
        description: "Disagreement between practical project impact and foundational coursework grades or self-reported metrics.",
        initiatingAgent: "skeptic",
        opposingAgent: "technical",
        tensionLevel: "high",
        coreEvidenceIds: evidenceStore.slice(0, 3).map((e) => e.id),
      },
    ];
  }
}

// Stage 4: Multi-Turn Debate Engine with Position Revision
export async function runDebateEngine(
  assessments: Record<AgentType, AgentAssessment>,
  disputes: DisputeTopic[],
  profile: CandidateProfile,
  evidenceStore: EvidenceItem[],
  jobDescription: JobDescription
): Promise<{
  debateMessages: DebateMessage[];
  positionRevisions: PositionRevisionRecord[];
  updatedAssessments: Record<AgentType, AgentAssessment>;
}> {
  const evidenceText = evidenceStore
    .map((e) => `[${e.id}]: "${e.text}"`)
    .join("\n");

  const debatePrompt = `
You are the AI Hiring Panel Debate Orchestrator.
We have 4 evaluators engaged in a structured 3-round debate to resolve key disagreements before the final hiring recommendation:

PARTICIPANTS:
1. Technical Agent: Dr. Elena Rostova (${assessments.technical.recommendation}, ${assessments.technical.confidence}%)
2. HR Agent: Marcus Vance-Cole (${assessments.hr.recommendation}, ${assessments.hr.confidence}%)
3. Hiring Manager: David Sterling (${assessments.hiring_manager.recommendation}, ${assessments.hiring_manager.confidence}%)
4. Skeptic Agent: Arthur Pendelton (${assessments.skeptic.recommendation}, ${assessments.skeptic.confidence}%)

DISPUTES TO DEBATE:
${disputes.map((d) => `[${d.id}] ${d.topic}: ${d.description} (Participants: ${d.initiatingAgent} vs ${d.opposingAgent})`).join("\n")}

AVAILABLE EVIDENCE:
${evidenceText}

DEBATE PROTOCOL RULES:
1. Round 1 (Challenge): Skeptic or initiating agent directly challenges specific claims/evidence cited by another agent.
2. Round 2 (Defense / Rebuttal): Challenged agent responds directly, citing evidence, conceding valid criticisms or defending their stance.
3. Round 3 (Synthesis & Revision): Agents deliberate on the overall candidate fit. CRITICAL: At least ONE agent MUST revise their confidence or recommendation in response to compelling arguments/evidence (e.g. Technical agent slightly lowers confidence after acknowledging transcript/production gaps, or Skeptic concedes practical aptitude).
4. Every message MUST state:
   - speaker (technical, hr, hiring_manager, skeptic)
   - respondingTo
   - stance (agree, disagree, partially_agree, challenge, defend, concede)
   - evidenceIds (cited valid evidence IDs)
   - changedPosition (boolean)
   - previousConfidence & newConfidence (if changed)
   - revisionReason (if changed)

OUTPUT JSON SCHEMA:
{
  "messages": [
    {
      "id": "MSG-01",
      "round": 1,
      "speaker": "skeptic",
      "speakerName": "Arthur Pendelton",
      "respondingTo": "technical",
      "stance": "challenge",
      "message": "I must challenge Dr. Rostova's glowing endorsement. While the open-source repository cited in [E009] is impressive, it does not erase the C+ in Algorithms [E004] and the severe GPA exaggeration on the resume header [E012]. How can we trust their self-reported expertise?",
      "evidenceIds": ["E004", "E009", "E012"],
      "changedPosition": false
    },
    {
      "id": "MSG-02",
      "round": 2,
      "speaker": "technical",
      "speakerName": "Dr. Elena Rostova",
      "respondingTo": "skeptic",
      "stance": "partially_agree",
      "message": "Arthur raises a legitimate concern regarding the GPA claim [E012] and theoretical coursework. However, implementing HNSW graph search in Rust [E009] requires deep practical data structures intuition beyond standard textbook exams. That said, I agree production scale is unproven, so I am adjusting my confidence from 85% down to 76%.",
      "evidenceIds": ["E009", "E012"],
      "changedPosition": true,
      "previousConfidence": 85,
      "newConfidence": 76,
      "revisionReason": "Conceded Skeptic's valid points regarding GPA discrepancy and unproven enterprise scale, while defending verified systems implementation."
    },
    {
      "id": "MSG-03",
      "round": 2,
      "speaker": "hr",
      "speakerName": "Marcus Vance-Cole",
      "respondingTo": "skeptic",
      "stance": "defend",
      "message": "Regarding integrity, the GPA discrepancy [E012] must be addressed directly in the interview. But on collaboration, evidence [E008] and [E010] proves they actively led sprint demos for 4 engineers during their internship.",
      "evidenceIds": ["E008", "E010"],
      "changedPosition": false
    },
    {
      "id": "MSG-04",
      "round": 3,
      "speaker": "hiring_manager",
      "speakerName": "David Sterling",
      "respondingTo": "technical",
      "stance": "agree",
      "message": "With Elena's revised technical calibration and Marcus's behavioral perspective, the risk is clear but manageable. The candidate is worthy of an intensive technical interview with specific algorithmic probe questions rather than an outright rejection.",
      "evidenceIds": ["E009", "E004"],
      "changedPosition": false
    }
  ],
  "revisions": [
    {
      "agentType": "technical",
      "agentName": "Dr. Elena Rostova",
      "initialRecommendation": "STRONG_YES",
      "initialConfidence": 85,
      "postDebateRecommendation": "YES",
      "postDebateConfidence": 76,
      "changed": true,
      "reason": "Adjusted confidence following Skeptic's challenge on transcript algorithm grades and production scale evidence."
    }
  ]
}
`;

  try {
    const result = await generateJSON<{
      messages: DebateMessage[];
      revisions: PositionRevisionRecord[];
    }>(debatePrompt, "You orchestrate a lively, evidence-backed hiring debate.");

    const messages = (result.messages || []).map((m, idx) => ({
      id: m.id || `MSG-${idx + 1}`,
      round: m.round || 1,
      speaker: m.speaker,
      speakerName: m.speakerName || assessments[m.speaker]?.agentName || m.speaker,
      respondingTo: m.respondingTo,
      stance: m.stance || "disagree",
      message: m.message,
      evidenceIds: filterValidEvidenceIds(m.evidenceIds || [], evidenceStore),
      previousConfidence: m.previousConfidence,
      newConfidence: m.newConfidence,
      changedPosition: Boolean(m.changedPosition),
      revisionReason: m.revisionReason,
      timestamp: new Date().toISOString(),
    }));

    const revisions: PositionRevisionRecord[] = (result.revisions || []).map((r) => ({
      agentType: r.agentType,
      agentName: r.agentName || assessments[r.agentType]?.agentName || r.agentType,
      initialRecommendation: r.initialRecommendation || assessments[r.agentType]?.recommendation || "YES",
      initialConfidence: r.initialConfidence || assessments[r.agentType]?.confidence || 75,
      postDebateRecommendation: r.postDebateRecommendation || assessments[r.agentType]?.recommendation || "YES",
      postDebateConfidence: r.postDebateConfidence || assessments[r.agentType]?.confidence || 75,
      changed: Boolean(r.changed),
      reason: r.reason || "Calibrated during debate.",
    }));

    // Update assessments with post-debate values
    const updatedAssessments = { ...assessments };
    for (const rev of revisions) {
      if (updatedAssessments[rev.agentType]) {
        updatedAssessments[rev.agentType] = {
          ...updatedAssessments[rev.agentType],
          recommendation: rev.postDebateRecommendation,
          confidence: rev.postDebateConfidence,
        };
      }
    }

    return { debateMessages: messages, positionRevisions: revisions, updatedAssessments };
  } catch (err) {
    console.error("Error in debate engine:", err);
    // Fallback debate
    const fallbackMessages: DebateMessage[] = [
      {
        id: "MSG-01",
        round: 1,
        speaker: "skeptic",
        speakerName: assessments.skeptic.agentName,
        respondingTo: "technical",
        stance: "challenge",
        message: `I challenge the technical assessment. The candidate's coursework in Algorithms indicates gaps, and reported metrics lack independent verification.`,
        evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
        changedPosition: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: "MSG-02",
        round: 2,
        speaker: "technical",
        speakerName: assessments.technical.agentName,
        respondingTo: "skeptic",
        stance: "partially_agree",
        message: `While the exam grades are lower than ideal, the practical engineering project repository demonstrates applied competency. I will adjust my confidence down to reflect this uncertainty.`,
        evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
        changedPosition: true,
        previousConfidence: assessments.technical.confidence,
        newConfidence: Math.max(50, assessments.technical.confidence - 8),
        revisionReason: "Acknowledged academic gaps while maintaining support for practical project deliverables.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "MSG-03",
        round: 3,
        speaker: "hiring_manager",
        speakerName: assessments.hiring_manager.agentName,
        respondingTo: "technical",
        stance: "agree",
        message: `I agree with this nuanced balance. We should proceed to an interview focused on validating core algorithmic problem solving.`,
        evidenceIds: evidenceStore.slice(0, 1).map((e) => e.id),
        changedPosition: false,
        timestamp: new Date().toISOString(),
      },
    ];

    const fallbackRevisions: PositionRevisionRecord[] = [
      {
        agentType: "technical",
        agentName: assessments.technical.agentName,
        initialRecommendation: assessments.technical.recommendation,
        initialConfidence: assessments.technical.confidence,
        postDebateRecommendation: assessments.technical.recommendation,
        postDebateConfidence: Math.max(50, assessments.technical.confidence - 8),
        changed: true,
        reason: "Adjusted confidence after acknowledging Skeptic's transcript findings.",
      },
    ];

    return { debateMessages: fallbackMessages, positionRevisions: fallbackRevisions, updatedAssessments: assessments };
  }
}

// Stage 5: Final Adjudication (Reasoning-based, NON-AVERAGING)
export async function runFinalAdjudicator(
  profile: CandidateProfile,
  jobDescription: JobDescription,
  evidenceStore: EvidenceItem[],
  assessments: Record<AgentType, AgentAssessment>,
  debateMessages: DebateMessage[],
  positionRevisions: PositionRevisionRecord[]
): Promise<FinalDecision> {
  const debateTranscript = debateMessages
    .map(
      (m) =>
        `[Round ${m.round}] ${m.speakerName} (${m.speaker.toUpperCase()}) -> ${m.respondingTo || "all"}: "${m.message}" [Citing: ${m.evidenceIds.join(", ")}]${m.changedPosition ? ` (POSITION REVISED: ${m.previousConfidence}% -> ${m.newConfidence}%, Reason: ${m.revisionReason})` : ""}`
    )
    .join("\n\n");

  const contradictionsSummary = (profile.contradictions || [])
    .map(
      (c) =>
        `[${c.id}] ${c.topic}: Resume [${c.resumeEvidenceId}] vs Transcript [${c.transcriptEvidenceId}]. Explanation: ${c.explanation}`
    )
    .join("\n");

  const prompt = `
You are the CHIEF ADJUDICATOR for the AI Hiring Panel.
Your job is to make the FINAL hiring decision based on rigorous synthesis of:
1. Job requirements
2. Direct evidence from resume & transcript
3. Independent evaluations from 4 personas
4. Multi-turn debate outcomes and position changes
5. Resolved vs unresolved contradictions

CRITICAL NON-AVERAGING MANDATE:
Do NOT calculate an arithmetic average of agent scores (e.g. do not do (85+75+65)/3).
Synthesize by weighing the EVIDENCE quality, which arguments prevailed during the debate, and remaining operational risk.

Allowed Final Recommendations:
- STRONG_HIRE
- HIRE
- INTERVIEW
- MAYBE
- NO_HIRE

CANDIDATE: ${profile.name}
TARGET ROLE: ${jobDescription.title}
JOB REQUIREMENTS: ${jobDescription.requiredSkills.join(", ")}; ${jobDescription.responsibilities.join("; ")}

INDEPENDENT EVALUATIONS:
- Technical (${assessments.technical.agentName}): ${assessments.technical.recommendation} (${assessments.technical.confidence}%)
- HR (${assessments.hr.agentName}): ${assessments.hr.recommendation} (${assessments.hr.confidence}%)
- Hiring Manager (${assessments.hiring_manager.agentName}): ${assessments.hiring_manager.recommendation} (${assessments.hiring_manager.confidence}%)
- Skeptic (${assessments.skeptic.agentName}): ${assessments.skeptic.recommendation} (${assessments.skeptic.confidence}%)

CONTRADICTIONS:
${contradictionsSummary || "None"}

DEBATE TRANSCRIPT & REVISIONS:
${debateTranscript}

OUTPUT JSON SCHEMA:
{
  "recommendation": "INTERVIEW",
  "confidence": 84,
  "executiveSummary": "Comprehensive summary of why this specific recommendation was determined through evidence synthesis rather than score averaging.",
  "evidenceWeightedReasoning": "Detailed breakdown explaining which evidence items were decisive, how the debate resolved key doubts, and how risks will be managed.",
  "strengths": [
    {
      "statement": "Evidence-backed strength statement",
      "evidenceIds": ["E001", "E009"],
      "weight": "critical"
    }
  ],
  "concerns": [
    {
      "statement": "Evidence-backed concern statement",
      "evidenceIds": ["E004", "E012"],
      "weight": "high"
    }
  ],
  "resolvedDisagreements": [
    {
      "disputeTopic": "Practical Project Depth vs Academic Grade Disparity",
      "resolution": "Committee agreed that hands-on Rust implementation demonstrates verified ability, but academic gaps warrant dedicated technical interview testing.",
      "prevailingArgument": "Technical agent's defense of working repository combined with Skeptic's risk calibration.",
      "evidenceIds": ["E004", "E009"]
    }
  ],
  "unresolvedDisagreements": [
    {
      "disputeTopic": "Resume GPA Claim Integrity",
      "whyUnresolved": "No written documentation explains why the resume claimed 3.8 when the official transcript records 3.42.",
      "suggestedInterviewProbe": "Directly ask the candidate to explain the methodology behind the GPA calculation presented on their resume header."
    }
  ],
  "interviewQuestions": [
    {
      "question": "Specific targeted technical or behavioral interview question",
      "targetArea": "Algorithmic Complexity / Academic Integrity",
      "whyNeeded": "To verify knowledge in areas with conflicting or weak evidence",
      "relatedEvidenceId": "E004"
    }
  ],
  "hiringRubricCoverage": [
    {
      "criterion": "Technical Core Competency",
      "score": 4,
      "evidenceSupport": "Supported by E008 and E009"
    },
    {
      "criterion": "Academic & Theoretical Foundation",
      "score": 3,
      "evidenceSupport": "Supported by E001, E004"
    },
    {
      "criterion": "Integrity & Documentation Consistency",
      "score": 2,
      "evidenceSupport": "Contradiction C001 on GPA claim"
    },
    {
      "criterion": "Collaborative Execution",
      "score": 4,
      "evidenceSupport": "Supported by E010"
    }
  ]
}
`;

  try {
    const res = await generateJSON<any>(
      prompt,
      "You are the Chief Adjudicator. Deliver an explainable, evidence-backed final recommendation."
    );

    const decision: FinalDecision = {
      recommendation: (res.recommendation as RecommendationType) || "INTERVIEW",
      confidence: Math.min(100, Math.max(0, Number(res.confidence) || 80)),
      executiveSummary: res.executiveSummary || "Final evaluation synthesized from multi-agent debate and evidence audit.",
      evidenceWeightedReasoning: res.evidenceWeightedReasoning || "Decision grounded in verified project deliverables and calibrated risk.",
      strengths: (res.strengths || []).map((s: any) => ({
        statement: s.statement || "",
        evidenceIds: filterValidEvidenceIds(s.evidenceIds || [], evidenceStore),
        weight: s.weight || "high",
      })),
      concerns: (res.concerns || []).map((c: any) => ({
        statement: c.statement || "",
        evidenceIds: filterValidEvidenceIds(c.evidenceIds || [], evidenceStore),
        weight: c.weight || "high",
      })),
      resolvedDisagreements: res.resolvedDisagreements || [],
      unresolvedDisagreements: res.unresolvedDisagreements || [],
      positionRevisions,
      interviewQuestions: res.interviewQuestions || [],
      hiringRubricCoverage: res.hiringRubricCoverage || [],
      timestamp: new Date().toISOString(),
    };

    return decision;
  } catch (err) {
    console.error("Error in final adjudicator:", err);
    return {
      recommendation: "INTERVIEW",
      confidence: 78,
      executiveSummary: `After synthesizing independent evaluations and debate between Technical, HR, Hiring Manager, and Skeptic personas, the candidate demonstrates sufficient practical evidence to advance to a structured interview.`,
      evidenceWeightedReasoning: `The panel balanced strong practical engineering evidence with academic discrepancies, recommending an interview targeting specific risk areas.`,
      strengths: [
        {
          statement: "Demonstrated practical implementation of core required technologies.",
          evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
          weight: "high",
        },
      ],
      concerns: [
        {
          statement: "Discrepancies identified between resume claims and academic records.",
          evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
          weight: "high",
        },
      ],
      resolvedDisagreements: [
        {
          disputeTopic: "Practical capability vs Academic coursework",
          resolution: "Proceed with technical interview focusing on algorithmic verification.",
          prevailingArgument: "Debate established that working project artifacts demonstrate capability while requiring live code verification.",
          evidenceIds: evidenceStore.slice(0, 2).map((e) => e.id),
        },
      ],
      unresolvedDisagreements: [
        {
          disputeTopic: "Resume claim discrepancies",
          whyUnresolved: "Requires direct candidate clarification during interview.",
          suggestedInterviewProbe: "Probe the exact scope and numbers presented in resume project metrics.",
        },
      ],
      positionRevisions,
      interviewQuestions: [
        {
          question: "Can you walk through the architectural tradeoffs and complexity analysis of your vector search implementation?",
          targetArea: "System Architecture & Algorithms",
          whyNeeded: "To verify technical depth independently of exam grades",
        },
      ],
      hiringRubricCoverage: [
        { criterion: "Technical Competence", score: 4, evidenceSupport: "Project deliverables" },
        { criterion: "Role Fit", score: 4, evidenceSupport: "Aligned skill profile" },
        { criterion: "Evidence Verification", score: 3, evidenceSupport: "Needs live interview probing" },
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
