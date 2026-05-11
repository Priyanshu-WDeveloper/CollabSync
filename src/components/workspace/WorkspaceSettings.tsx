import React, { useState, FormEvent } from 'react';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { Button, Input } from '../ui/index.js';
import toast from 'react-hot-toast';

interface WorkspaceSettingsProps {
  onClose?: () => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ onClose }) => {
  const { currentWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [name, setName] = useState(currentWorkspace?.name || '');
  const [description, setDescription] = useState(currentWorkspace?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = currentWorkspace?.owner?._id === user?._id;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    setIsLoading(true);
    try {
      await updateWorkspace(currentWorkspace!._id, { name, description });
      toast.success('Workspace updated successfully');
      onClose?.();
    } catch {
      toast.error('Failed to update workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkspace(currentWorkspace!._id);
      toast.success('Workspace deleted');
      onClose?.();
    } catch {
      toast.error('Failed to delete workspace');
    }
  };

  if (!isOwner) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
        <p className="text-slate-400">Only the workspace owner can modify settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Workspace Settings</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Workspace"
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional workspace description..."
              rows={3}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="border-t border-dark-600 pt-6">
        <h4 className="text-md font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle size={18} />
          Danger Zone
        </h4>
        {showDeleteConfirm ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to delete <strong className="text-white">{currentWorkspace?.name}</strong>?
              This action cannot be undone and all workspace data will be lost.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-1"
              >
                <Trash2 size={14} />
                Confirm Delete
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete Workspace
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSettings;