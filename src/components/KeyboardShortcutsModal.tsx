import React from 'react';
import { Keyboard, X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 - 5', label: 'Navigate Tabs (Dossier, Evaluators, Debate, Evidence, Profile)' },
    { key: 'Space', label: 'Play / Pause Multi-Voice Committee Debate' },
    { key: '/', label: 'Quick Focus Evidence Search' },
    { key: '?', label: 'Open Keyboard Shortcuts Help' },
    { key: 'Esc', label: 'Close Active Modal / Evidence Viewer' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FDFCFB] border border-[#121212]/20 rounded-xs shadow-2xl p-6 text-[#121212] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#121212]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#EFECE7] border border-[#121212]/15 text-[#121212]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-base font-serif-editorial font-bold text-[#121212]">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-[#57534E] font-serif-editorial italic">
                Efficiency and Power-User Navigation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            className="text-[#57534E] hover:text-[#121212] p-1 rounded-xs hover:bg-[#F4F1EA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xs bg-[#FFFFFF] border border-[#121212]/10 text-xs"
            >
              <span className="text-[#292524] font-medium">{s.label}</span>
              <kbd className="px-2 py-1 text-[11px] font-mono font-bold text-[#121212] bg-[#EFECE7] border border-[#121212]/20 rounded-xs shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-[11px] text-[#57534E] font-serif-editorial italic">
          Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[#EFECE7] rounded-xs border border-[#121212]/15">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
};
