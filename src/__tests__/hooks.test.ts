import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebateAudio } from '../hooks/useDebateAudio';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { DEFAULT_SESSIONS } from '../data/defaultSessions';

describe('Custom Hooks Suite', () => {
  const sampleMessages = DEFAULT_SESSIONS['cand-alex-rivera'].debateMessages;

  beforeEach(() => {
    // Setup window.speechSynthesis mock
    const mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([
        { name: 'Google UK English Female', lang: 'en-GB' },
        { name: 'Google UK English Male', lang: 'en-GB' },
      ]),
      onvoiceschanged: null,
    };
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
    });
  });

  it('initializes useDebateAudio with default playback state', () => {
    const { result } = renderHook(() => useDebateAudio(sampleMessages));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.speed).toBe(1.0);
  });

  it('cycles audio speed across 1.0x -> 1.25x -> 1.5x -> 1.0x', () => {
    const { result } = renderHook(() => useDebateAudio(sampleMessages));

    act(() => {
      result.current.cycleSpeed();
    });
    expect(result.current.speed).toBe(1.25);

    act(() => {
      result.current.cycleSpeed();
    });
    expect(result.current.speed).toBe(1.5);

    act(() => {
      result.current.cycleSpeed();
    });
    expect(result.current.speed).toBe(1.0);
  });

  it('dispatches keyboard shortcuts for tab navigation and dialog triggers', () => {
    const onSelectTab = vi.fn();
    const onToggleShortcutsModal = vi.fn();
    const onCloseModals = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSelectTab,
        onToggleShortcutsModal,
        onCloseModals,
      })
    );

    // Simulate key press '1'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    });
    expect(onSelectTab).toHaveBeenCalledWith(0);

    // Simulate key press '3'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    });
    expect(onSelectTab).toHaveBeenCalledWith(2);

    // Simulate key press '?'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
    });
    expect(onToggleShortcutsModal).toHaveBeenCalled();

    // Simulate key press 'Escape'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onCloseModals).toHaveBeenCalled();
  });
});
