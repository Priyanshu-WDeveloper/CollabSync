import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../ui/index.js';
import WorkspaceSettingsForm from './WorkspaceSettings.jsx';
import MemberManagement from './MemberManagement.jsx';

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        // Trap focus
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-settings-title"
        tabIndex={-1}
        className="relative bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-600">
          <h2 id="workspace-settings-title" className="text-xl font-bold font-display text-white">Workspace Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close workspace settings"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-600 px-6" role="tablist" aria-label="Settings tabs">
          {['settings', 'members'].map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              tabIndex={activeTab === tab ? 0 : -1}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
          role="tabpanel"
          id="panel-settings"
          aria-labelledby="tab-settings"
        >
          {activeTab === 'settings' ? (
            <WorkspaceSettingsForm onClose={onClose} />
          ) : (
            <MemberManagement onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsModal;