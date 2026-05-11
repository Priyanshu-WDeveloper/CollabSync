import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '../ui/index.js';
import {
  Calendar,
  Users,
  Trash2,
  X,
  Check,
  Edit3,
  Paperclip,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { TASK_STATUS, TASK_STATUS_LABELS, Task, TaskStatus } from '../../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: string) => Promise<unknown>;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onStatusChange
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
    }
  }, [task]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [isEditingDesc]);

  if (!task) return null;

  const handleSaveTitle = async () => {
    if (!title.trim() || title === task.title) {
      setTitle(task.title);
      setIsEditingTitle(false);
      return;
    }
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { title: title.trim() });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update title:', error);
      setTitle(task.title);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDescription = async () => {
    if (description === task.description) {
      setIsEditingDesc(false);
      return;
    }
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { description });
      setIsEditingDesc(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      setDescription(task.description || '');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      try {
        await onStatusChange(task._id, newStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const statusOptions = [
    { value: TASK_STATUS.TODO, label: TASK_STATUS_LABELS[TASK_STATUS.TODO], color: 'bg-slate-500' },
    { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: 'bg-amber-500' },
    { value: TASK_STATUS.DONE, label: TASK_STATUS_LABELS[TASK_STATUS.DONE], color: 'bg-emerald-500' }
  ];

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TASK_STATUS.DONE;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-dark-600">
          <div className="flex-1 pr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTitle(task.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-700 border border-dark-500 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isUpdating}
                />
                <button
                  onClick={handleSaveTitle}
                  disabled={isUpdating}
                  className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setTitle(task.title);
                    setIsEditingTitle(false);
                  }}
                  className="p-2 rounded-lg bg-dark-600 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div
                className="group flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <h2 className="text-xl font-semibold text-white">{task.title}</h2>
                <Edit3 size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Status Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as TaskStatus)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    task.status === option.value
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-dark-600 bg-dark-700 text-slate-400 hover:border-dark-500'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${option.color}`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Description</label>
            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  ref={descInputRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Add a description..."
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveDescription}
                    isLoading={isUpdating}
                  >
                    <Check size={16} className="mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setDescription(task.description || '');
                      setIsEditingDesc(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className={`p-4 rounded-xl border cursor-pointer transition-all min-h-[80px] ${
                  description
                    ? 'bg-dark-700 border-dark-600 hover:border-dark-500'
                    : 'bg-dark-700/50 border-dark-600 border-dashed hover:border-dark-500'
                }`}
              >
                <p className={`text-sm ${description ? 'text-slate-300' : 'text-slate-500'}`}>
                  {description || 'Click to add a description...'}
                </p>
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Due Date</label>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                isOverdue ? 'bg-red-500/10 border-red-500/30' : 'bg-dark-700 border-dark-600'
              }`}>
                <Calendar size={18} className={isOverdue ? 'text-red-400' : 'text-slate-400'} />
                {task.dueDate ? (
                  <span className={`text-sm ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    {isOverdue && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle size={12} />
                        Overdue
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">No due date</span>
                )}
              </div>
            </div>

            {/* Created Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Created</label>
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-dark-700 border-dark-600">
                <Clock size={18} className="text-slate-400" />
                <span className="text-sm text-slate-300">
                  {format(new Date(task.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Assignees Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={14} />
                Assignees
              </div>
            </label>
            <div className="p-4 rounded-xl border bg-dark-700 border-dark-600">
              {task.assignees && task.assignees.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee._id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-600"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-sm text-white font-medium">
                        {(assignee.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-white">
                        {assignee.username || 'Unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users size={24} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No assignees</p>
                </div>
              )}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <Paperclip size={14} />
                Attachments
              </div>
            </label>
            <div className="p-4 rounded-xl border bg-dark-700 border-dark-600">
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors"
                    >
                      <Paperclip size={16} className="text-slate-400" />
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 truncate flex-1"
                      >
                        {attachment.split('/').pop() || `Attachment ${index + 1}`}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Paperclip size={24} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No attachments</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-600 mt-4">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Delete this task?</span>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Task
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Updated {format(new Date(task.updatedAt), 'MMM d, h:mm a')}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;