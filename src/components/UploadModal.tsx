import React, { useState } from 'react';
import { X, Upload, Sparkles, Check } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeCustom: (data: {
    resumeText: string;
    transcriptText: string;
    jobDescriptionText: string;
    candidateName?: string;
  }) => void;
  isProcessing: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeCustom,
  isProcessing,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'resume' | 'transcript' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (target === 'resume') setResumeText(text);
      else if (target === 'transcript') setTranscriptText(text);
      else if (target === 'jd') setJobDescriptionText(text);
    };
    reader.readAsText(file);
  };

  const loadPreset = (preset: 'ml_intern' | 'contradiction_demo') => {
    if (preset === 'ml_intern') {
      setCandidateName('Jordan Taylor');
      setResumeText(`JORDAN TAYLOR
jordan.t@cs.edu | GitHub: github.com/jtaylor-dev

EDUCATION:
B.S. in Computer Science, Tech University, Class of 2024
Reported GPA: 3.85 / 4.00

EXPERIENCE:
AI Software Engineer Intern | Quantum Data Inc. (May 2023 - Aug 2023)
- Built distributed training pipelines using PyTorch and Horovod across 8 GPUs.
- Optimized REST endpoints with FastAPI and Redis caching, improving throughput by 35%.
- Contributed to team sprint demos and technical documentation.

PROJECTS:
AudioClassifier: Real-time spectrogram audio classification model in Python and ONNX Runtime.

SKILLS:
Python (Advanced), PyTorch, SQL, Docker, FastAPI, Git, Algorithms`);

      setTranscriptText(`OFFICIAL ACADEMIC TRANSCRIPT
Tech University — Office of Records
Student: Jordan Taylor | ID: TU-88402
Degree: B.S. in Computer Science, May 2024
CUMULATIVE GPA: 3.55 / 4.00

GRADES:
- CS 101: Computer Science I — A (4.0)
- CS 202: Data Structures & Algorithms — B+ (3.3)
- CS 340: Machine Learning Systems — A (4.0)
- CS 370: Operating Systems & Concurrency — B- (2.7)
- MATH 210: Linear Algebra — A (4.0)`);

      setJobDescriptionText(`JOB TITLE: AI Infrastructure Engineer
DEPARTMENT: Machine Learning Platform
REQUIREMENTS:
- Proficiency in Python, PyTorch, and distributed systems.
- Experience with FastAPI and relational/caching databases.
- Strong foundational coursework in algorithms and linear algebra.
- Proactive team communication.`);
    } else if (preset === 'contradiction_demo') {
      setCandidateName('Derek Sterling');
      setResumeText(`DEREK STERLING
derek@sysops.io

SUMMARY:
Lead Architect with 8+ years deep expertise in Kubernetes and Cloud Architecture.

EDUCATION:
B.S. in Software Systems, 2022
GPA: 3.90

EXPERIENCE:
Lead Cloud Engineer | Enterprise Freelance (2022 - Present)
- Deployed multi-region zero-downtime Kubernetes architecture for Fortune 100 enterprise.
- Managed $1M monthly AWS cloud budget.`);

      setTranscriptText(`COLLEGE TRANSCRIPT
Student: Derek Sterling
Degree: B.S. in Software Systems, Graduated Dec 2022
GPA: 2.65 / 4.00

COURSEWORK:
- CS 210: Networks — C (2.0)
- CS 320: Cloud Architecture — C- (1.7)
- CS 101: Intro to Python — B (3.0)`);

      setJobDescriptionText(`JOB TITLE: Senior Kubernetes & Cloud Architect
REQUIREMENTS:
- 4+ years enterprise Kubernetes experience.
- Verifiable client references and architecture design track record.
- High ethical standards and accurate technical documentation.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescriptionText.trim()) return;

    onAnalyzeCustom({
      resumeText,
      transcriptText,
      jobDescriptionText,
      candidateName: candidateName.trim() || 'Custom Candidate',
    });
  };

  return (
    <div
      id="upload-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="upload-modal-container"
        className="w-full max-w-3xl bg-[#FDFCFB] border border-[#121212]/20 rounded-xs shadow-2xl overflow-hidden p-6 sm:p-7 relative text-[#121212] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#121212]/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] text-[#D94F33]" aria-hidden="true">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-xl font-serif-editorial font-bold text-[#121212]">
                Custom Candidate Ingestion
              </h2>
              <p className="text-xs text-[#57534E] font-serif-editorial italic mt-0.5">
                Supply Resume, Academic Transcript, and Role Specification for multi-agent evaluation
              </p>
            </div>
          </div>
          <button
            id="btn-close-upload-modal"
            type="button"
            aria-label="Close custom candidate upload dialog"
            onClick={onClose}
            className="text-[#57534E] hover:text-[#121212] p-1.5 rounded-xs hover:bg-[#F4F1EA] transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D94F33]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="py-2.5 px-4 bg-[#FAF0E6]/50 border-b border-[#121212]/10 flex items-center justify-between gap-3 text-xs flex-wrap">
          <span className="text-[#8C510A] flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-[#C2781D]" />
            Quick Scenarios:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadPreset('ml_intern')}
              className="px-2.5 py-1 rounded-xs bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/15 font-serif-editorial font-medium transition-colors cursor-pointer text-xs shadow-2xs"
            >
              ML Intern Profile
            </button>
            <button
              type="button"
              onClick={() => loadPreset('contradiction_demo')}
              className="px-2.5 py-1 rounded-xs bg-[#FDF0EE] hover:bg-[#FBE5E2] text-[#A82A2A] border border-[#F0C4BD] font-serif-editorial font-medium transition-colors cursor-pointer text-xs shadow-2xs"
            >
              Exaggeration vs Transcript
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1.5">
              Candidate Name (Optional)
            </label>
            <input
              id="input-candidate-name"
              type="text"
              placeholder="e.g. Jordan Taylor"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#121212]/20 rounded-xs px-3.5 py-2 text-sm text-[#121212] placeholder-[#78716C] focus:outline-hidden focus:border-[#121212]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#121212] flex items-center gap-1">
                  <span>Resume / CV Content</span>
                  <span className="text-[#D94F33]">*</span>
                </label>
                <label className="text-[11px] text-[#D94F33] hover:text-[#B83A20] cursor-pointer font-bold uppercase tracking-wider">
                  Upload file (.txt, .md)
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={(e) => handleFileUpload(e, 'resume')}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                id="input-resume-text"
                rows={6}
                required
                placeholder="Paste candidate resume text, skills, experience, and projects..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#121212]/20 rounded-xs p-3 text-xs font-mono text-[#121212] placeholder-[#78716C] focus:outline-hidden focus:border-[#121212] leading-relaxed"
              />
            </div>

            {/* Transcript */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#121212] flex items-center gap-1">
                  <span>Academic Transcript</span>
                  <span className="text-[#78716C] font-normal lowercase">(optional)</span>
                </label>
                <label className="text-[11px] text-[#D94F33] hover:text-[#B83A20] cursor-pointer font-bold uppercase tracking-wider">
                  Upload file (.txt, .md)
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={(e) => handleFileUpload(e, 'transcript')}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                id="input-transcript-text"
                rows={6}
                placeholder="Paste official transcript coursework, grades, institution records..."
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#121212]/20 rounded-xs p-3 text-xs font-mono text-[#121212] placeholder-[#78716C] focus:outline-hidden focus:border-[#121212] leading-relaxed"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#121212] flex items-center gap-1">
                <span>Job Description & Role Requirements</span>
                <span className="text-[#D94F33]">*</span>
              </label>
              <label className="text-[11px] text-[#D94F33] hover:text-[#B83A20] cursor-pointer font-bold uppercase tracking-wider">
                Upload file (.txt, .md)
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={(e) => handleFileUpload(e, 'jd')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              id="input-job-description-text"
              rows={4}
              required
              placeholder="Paste job title, required skills, preferred qualifications, and responsibilities..."
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#121212]/20 rounded-xs p-3 text-xs font-mono text-[#121212] placeholder-[#78716C] focus:outline-hidden focus:border-[#121212] leading-relaxed"
            />
          </div>

          <div className="pt-3.5 border-t border-[#121212]/15 flex items-center justify-between">
            <span className="text-xs text-[#57534E] font-serif-editorial italic">
              {resumeText && jobDescriptionText ? (
                <span className="text-[#2D5A3F] flex items-center gap-1 font-bold not-italic font-sans text-xs">
                  <Check className="w-3.5 h-3.5" /> Ready for AI Panel evaluation
                </span>
              ) : (
                'Resume & Job Description required'
              )}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-[#121212] rounded-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-candidate-analysis"
                type="submit"
                disabled={isProcessing || !resumeText.trim() || !jobDescriptionText.trim()}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#D94F33] hover:bg-[#B83A20] text-white rounded-xs shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Panel Evaluation</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

