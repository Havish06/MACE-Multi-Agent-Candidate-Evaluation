import { useEffect } from 'react';

interface ShortcutHandlers {
  onSelectTab?: (index: number) => void;
  onToggleDebateAudio?: () => void;
  onToggleShortcutsModal?: () => void;
  onCloseModals?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts({
  onSelectTab,
  onToggleDebateAudio,
  onToggleShortcutsModal,
  onCloseModals,
  onFocusSearch,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcut triggers if the user is typing inside an input, textarea or select
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement as HTMLElement).isContentEditable);

      if (event.key === 'Escape') {
        if (onCloseModals) {
          event.preventDefault();
          onCloseModals();
        }
        return;
      }

      if (isInput) return;

      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        if (onToggleShortcutsModal) {
          event.preventDefault();
          onToggleShortcutsModal();
        }
      } else if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        if (onFocusSearch) {
          event.preventDefault();
          onFocusSearch();
        }
      } else if (['1', '2', '3', '4', '5'].includes(event.key)) {
        const tabIndex = parseInt(event.key, 10) - 1;
        if (onSelectTab) {
          event.preventDefault();
          onSelectTab(tabIndex);
        }
      } else if (event.code === 'Space' && !event.repeat) {
        if (onToggleDebateAudio) {
          event.preventDefault();
          onToggleDebateAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab, onToggleDebateAudio, onToggleShortcutsModal, onCloseModals, onFocusSearch]);
}
