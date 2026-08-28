import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { EvidenceModal } from '../components/EvidenceModal';
import { SAMPLE_CANDIDATES } from '../data/sampleCandidates';

describe('Accessibility & Keyboard Dialogs', () => {
  const mockCandidate = SAMPLE_CANDIDATES[0];

  it('renders KeyboardShortcutsModal with aria-modal and proper dialog role', () => {
    const handleClose = vi.fn();
    render(<KeyboardShortcutsModal isOpen={true} onClose={handleClose} />);

    const dialog = screen.getByRole('dialog', { name: /Keyboard Shortcuts/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    expect(screen.getByText(/Navigate Tabs/i)).toBeInTheDocument();
    expect(screen.getByText(/Play \/ Pause Multi-Voice Committee Debate/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close shortcuts dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not render KeyboardShortcutsModal when isOpen is false', () => {
    const { container } = render(<KeyboardShortcutsModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders EvidenceModal with dialog accessibility landmarks and closes on button click', () => {
    const handleClose = vi.fn();
    render(
      <EvidenceModal
        evidenceId="E001"
        evidenceStore={mockCandidate.evidenceStore}
        contradictions={mockCandidate.candidateProfile.contradictions}
        onClose={handleClose}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const closeBtn = screen.getByRole('button', { name: 'Close Viewer' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
