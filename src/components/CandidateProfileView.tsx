import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Code2,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';
import { CandidateProfile, EvidenceItem, JobDescription } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface CandidateProfileViewProps {
  profile: CandidateProfile;
  jobDescription: JobDescription;
  evidenceStore: EvidenceItem[];
  onSelectEvidence: (id: string) => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  profile,
  jobDescription,
  evidenceStore,
  onSelectEvidence,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Candidate Overview Header */}
      <div className="p-6 sm:p-7 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xs bg-[#121212] text-[#FDFCFB] flex items-center justify-center font-serif-editorial font-bold text-xl shadow-2xs shrink-0">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-serif-editorial font-bold text-[#121212] tracking-tight">{profile.name}</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] bg-[#FAF0E6] text-[#8C510A] border border-[#E5CFB8] rounded-xs">
                Candidate for: {jobDescription.title}
              </span>
            </div>
            <p className="text-xs text-[#57534E] mt-1.5 max-w-2xl leading-relaxed font-serif-editorial italic text-[13px]">
              {profile.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Education & Academic Coursework */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <h3 className="text-xs font-bold text-[#121212] uppercase tracking-[0.16em] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2D5A3F]" />
              <span>Academic Transcript & Coursework</span>
            </h3>
            <span className="text-xs text-[#57534E] font-serif-editorial italic">Official Records</span>
          </div>

          {/* Education Degrees */}
          <div className="space-y-2">
            {(profile.education || []).map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-serif-editorial font-bold text-sm text-[#121212]">{edu.degree} in {edu.major}</div>
                  <div className="text-[#57534E] font-serif-editorial italic text-xs">{edu.institution} ({edu.graduationYear})</div>
                  <div className="text-[#2D5A3F] font-mono text-[11px] font-bold mt-1">
                    Cumulative GPA: {edu.gpa}
                  </div>
                </div>
                {edu.evidenceId && (
                  <EvidenceBadge
                    id={edu.evidenceId}
                    evidenceStore={evidenceStore}
                    onSelectEvidence={onSelectEvidence}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Coursework Table */}
          {profile.courses && profile.courses.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#57534E] block mb-2">
                Recorded Technical Courses & Grades:
              </span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {profile.courses.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xs bg-[#FDFCFB] border border-[#121212]/10 flex items-center justify-between text-xs"
                  >
                    <span className="text-[#121212] font-medium">{c.courseName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#D94F33] bg-[#FDF0EE] px-1.5 py-0.5 rounded-xs border border-[#F0C4BD]">{c.grade}</span>
                      {c.evidenceId && (
                        <EvidenceBadge
                          id={c.evidenceId}
                          evidenceStore={evidenceStore}
                          onSelectEvidence={onSelectEvidence}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Verified Skills Matrix */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <h3 className="text-xs font-bold text-[#121212] uppercase tracking-[0.16em] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D94F33]" />
              <span>Skills Verification Matrix</span>
            </h3>
            <span className="text-xs text-[#57534E] font-serif-editorial italic">Cross-Referenced</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {(profile.skills || []).map((sk, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#121212]">{sk.name}</span>
                    <span className="px-1.5 py-0.2 rounded-xs text-[10px] uppercase font-mono bg-[#EFECE7] text-[#121212] border border-[#121212]/10">
                      {sk.levelClaimed}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px]">
                    {sk.isVerifiedByProjectOrCourse ? (
                      <span className="text-[#2D5A3F] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified by Primary Artifact
                      </span>
                    ) : (
                      <span className="text-[#C2781D] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> Unverified Self-Claim
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 shrink-0">
                  {(sk.evidenceIds || []).map((eid) => (
                    <EvidenceBadge
                      key={eid}
                      id={eid}
                      evidenceStore={evidenceStore}
                      onSelectEvidence={onSelectEvidence}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Work Experience */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3.5 shadow-2xs">
          <h3 className="text-xs font-bold text-[#121212] uppercase tracking-[0.16em] flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <Briefcase className="w-4 h-4 text-[#D94F33]" />
            <span>Work & Internship Experience</span>
          </h3>

          <div className="space-y-3">
            {(profile.experience || []).map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif-editorial font-bold text-sm text-[#121212]">{exp.role}</span>
                    <span className="text-[#57534E] block font-serif-editorial italic text-xs mt-0.5">{exp.company} • {exp.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(exp.evidenceIds || []).map((eid) => (
                      <EvidenceBadge
                        key={eid}
                        id={eid}
                        evidenceStore={evidenceStore}
                        onSelectEvidence={onSelectEvidence}
                      />
                    ))}
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-[#292524] text-[11px] leading-relaxed">
                  {(exp.responsibilities || []).map((r, rIdx) => (
                    <li key={rIdx}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Projects */}
        <div className="p-5 sm:p-6 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3.5 shadow-2xs">
          <h3 className="text-xs font-bold text-[#121212] uppercase tracking-[0.16em] flex items-center gap-2 pb-2 border-b border-[#121212]/10">
            <Award className="w-4 h-4 text-[#C2781D]" />
            <span>Technical Projects & Deliverables</span>
          </h3>

          <div className="space-y-3">
            {(profile.projects || []).map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif-editorial font-bold text-sm text-[#121212]">{proj.title}</span>
                  <div className="flex flex-wrap gap-1">
                    {(proj.evidenceIds || []).map((eid) => (
                      <EvidenceBadge
                        key={eid}
                        id={eid}
                        evidenceStore={evidenceStore}
                        onSelectEvidence={onSelectEvidence}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(proj.technologies || []).map((t, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.2 rounded-xs bg-[#EFECE7] text-[#121212] text-[10px] font-mono border border-[#121212]/10">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-[#292524] text-xs font-serif-editorial italic leading-relaxed">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

