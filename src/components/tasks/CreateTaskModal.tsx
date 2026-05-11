import React, { useState, useMemo, useRef, FormEvent } from 'react';
import { Modal, Button, Input } from '../ui/index.js';

interface CreateTaskModalProps {
  workspaceId: string;
  onClose: () => void;
  onCreate: (data: { title: string; description?: string }) => Promise<unknown>;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ workspaceId, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  React.useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreate({ title, description });
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create task form">
        <Input
          ref={firstInputRef}
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-300">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;