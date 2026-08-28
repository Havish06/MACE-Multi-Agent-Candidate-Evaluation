import React from 'react';
import {
  RotateCw,
  CheckCircle2,
  BrainCircuit,
  Users,
  MessageSquareQuote,
  Scale,
  Shield,
  FileCheck
} from 'lucide-react';

interface PipelineProgressModalProps {
  isOpen: boolean;
  currentStep: number; // 1 to 6
  stepTitle: string;
  stepDescription: string;
}

export const PipelineProgressModal: React.FC<PipelineProgressModalProps> = ({
  isOpen,
  currentStep,
  stepTitle,
  stepDescription,
}) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'Document Ingestion', icon: <FileCheck className="w-4 h-4" /> },
    { num: 2, title: 'Evidence & Contradictions', icon: <BrainCircuit className="w-4 h-4" /> },
    { num: 3, title: '4-Agent Isolated Evaluation', icon: <Users className="w-4 h-4" /> },
    { num: 4, title: 'Disagreement Detection', icon: <Shield className="w-4 h-4" /> },
    { num: 5, title: 'Multi-Turn Debate Engine', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { num: 6, title: 'Final Adjudication', icon: <Scale className="w-4 h-4" /> },
  ];

  return (
    <div
      id="pipeline-progress-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pipeline-progress-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="pipeline-progress-card"
        className="w-full max-w-lg bg-[#FDFCFB] border border-[#121212]/20 rounded-xs shadow-2xl p-6 sm:p-7 text-[#121212] space-y-6"
      >
        <div className="flex items-center gap-3.5 pb-4 border-b border-[#121212]/15">
          <div className="p-3 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] text-[#D94F33]" aria-hidden="true">
            <RotateCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 id="pipeline-progress-title" className="text-lg font-serif-editorial font-bold text-[#121212]">
              Multi-Agent Evaluation Pipeline
            </h3>
            <p className="text-xs text-[#57534E] font-serif-editorial italic">
              Orchestrating isolated agents, dialectic debate & synthesis...
            </p>
          </div>
        </div>

        {/* Current Active Step Highlight */}
        <div
          role="progressbar"
          aria-valuenow={Math.round((currentStep / 6) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Pipeline Stage ${currentStep} of 6: ${stepTitle}`}
          aria-live="polite"
          className="p-4 rounded-xs bg-[#FAF0E6] border border-[#E5CFB8] space-y-1"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#8C510A] uppercase tracking-wider">
            <span className="font-serif-editorial">Stage {currentStep} of 6: {stepTitle}</span>
            <span className="font-mono">{Math.round((currentStep / 6) * 100)}%</span>
          </div>
          <p className="text-xs text-[#57534E] font-serif-editorial italic leading-relaxed">{stepDescription}</p>
        </div>

        {/* Step Progress List */}
        <div className="space-y-1.5">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className={`flex items-center justify-between p-2.5 rounded-xs text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#FDF0EE] border border-[#F0C4BD] text-[#D94F33] font-bold'
                    : isCompleted
                    ? 'bg-[#FFFFFF] border border-[#121212]/10 text-[#121212]'
                    : 'bg-transparent text-[#A8A29E] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-xs flex items-center justify-center text-xs font-mono font-bold ${
                      isCompleted
                        ? 'bg-[#E9F2EC] text-[#2D5A3F] border border-[#B4D5C2]'
                        : isCurrent
                        ? 'bg-[#D94F33] text-white animate-pulse'
                        : 'bg-[#EFECE7] text-[#78716C] border border-[#121212]/10'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className="font-serif-editorial">{s.title}</span>
                </div>

                <div>
                  {isCurrent && <RotateCw className="w-3.5 h-3.5 animate-spin text-[#D94F33]" />}
                  {isCompleted && <span className="text-[#2D5A3F] text-[10px] font-mono font-bold uppercase tracking-wider">Completed</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

