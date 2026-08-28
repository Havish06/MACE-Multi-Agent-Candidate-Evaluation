import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { LogIn, LogOut, User as UserIcon, Shield, Sparkles, X } from 'lucide-react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInAsGuest, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setAuthErr(null);
      await signInWithGoogle();
      onClose();
    } catch (e: any) {
      setAuthErr(e?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsSubmitting(true);
      setAuthErr(null);
      await signInAsGuest();
      onClose();
    } catch (e: any) {
      setAuthErr(e?.message || 'Guest login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FDFCFB] border border-[#121212]/20 rounded-xs shadow-2xl p-6 text-[#121212] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#121212]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#FDF0EE] border border-[#F0C4BD] text-[#D94F33]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-serif-editorial font-bold text-[#121212]">
                Evaluator Authentication
              </h2>
              <p className="text-xs text-[#57534E] font-serif-editorial italic">
                Firebase Identity & Security Protection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-[#57534E] hover:text-[#121212] p-1 rounded-xs hover:bg-[#F4F1EA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#57534E] leading-relaxed">
          Sign in to securely access the AI Hiring Panel, preserve evaluation dossiers in Firestore, and audit candidate verification records with full RBAC protection.
        </p>

        {(authErr || error) && (
          <div className="p-3 text-xs bg-[#FDF0EE] text-[#D94F33] border border-[#F0C4BD] rounded-xs font-mono">
            {authErr || error}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/30 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-[#121212]/15"></div>
            <span className="shrink mx-3 text-[10px] text-[#57534E] uppercase tracking-wider font-bold">Or</span>
            <div className="grow border-t border-[#121212]/15"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EFECE7] hover:bg-[#E2DDD5] text-[#121212] border border-[#121212]/20 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <UserIcon className="w-4 h-4 text-[#57534E]" />
            <span>Continue as Guest Evaluator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
