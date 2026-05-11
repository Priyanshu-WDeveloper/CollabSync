import { useEffect, useCallback, useRef } from 'react';

interface Shortcut {
  key: string;
  callback: (e: KeyboardEvent) => void;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  allowInInput?: boolean;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts?: Shortcut[];
  trapFocus?: boolean;
  trapContainerRef?: React.RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

/**
 * Hook for managing keyboard shortcuts with focus trap support.
 */
const useKeyboardShortcuts = (
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { shortcuts = [], trapFocus = false, trapContainerRef, onEscape } = options;
  const enabled = options.enabled ?? true;
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  const trapFocusInContainer = useCallback(() => {
    if (!trapContainerRef?.current) return;

    const container = trapContainerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [trapContainerRef]);

  // Register keyboard shortcuts
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key separately if callback provided
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Check each shortcut
      for (const shortcut of shortcuts) {
        const { key, callback, modifiers = {} } = shortcut;

        // Normalize key comparison (handle 'n' vs 'N', etc.)
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();

        // Check modifier keys
        const ctrlMatch = modifiers.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = modifiers.shift ? e.shiftKey : true;
        const altMatch = modifiers.alt ? e.altKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Don't trigger if user is typing in an input/textarea (unless specified)
          const target = e.target as HTMLElement;
          const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
                             target.isContentEditable;

          if (isInputField && !shortcut.allowInInput) {
            continue;
          }

          e.preventDefault();
          callback(e);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, shortcuts, onEscape]);

  // Focus trap effect
  useEffect(() => {
    if (!enabled || !trapFocus || !trapContainerRef?.current) return;

    // Store current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus first focusable element
    const cleanup = trapFocusInContainer();
    const firstFocusable = trapContainerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      setTimeout(() => (firstFocusable as HTMLElement).focus(), 0);
    }

    return () => {
      cleanup?.();
      // Restore focus when unmounting
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, trapFocus, trapContainerRef, trapFocusInContainer]);

  return {
    trapFocusInContainer
  };
};

export default useKeyboardShortcuts;

/**
 * Common keyboard shortcut definitions
 */
export const SHORTCUTS = {
  NEW_TASK: { key: 'n', description: 'Create new task', allowInInput: false },
  SEARCH: { key: '/', description: 'Focus search', allowInInput: false },
  ESCAPE: { key: 'Escape', description: 'Close modal/dialog', allowInInput: true },
  CONFIRM: { key: 'Enter', description: 'Confirm action', allowInInput: false },
  SAVE: { key: 's', description: 'Save', modifiers: { ctrl: true }, allowInInput: false }
};