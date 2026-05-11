import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Users, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onClick?: (task: Task) => void;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ task, isDragging = false, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  const handleClick = (e: React.MouseEvent) => {
    if (isCurrentlyDragging) return;
    onClick?.(task);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      role="listitem"
      aria-label={`Task: ${task.title}${task.description ? `. ${task.description}` : ''}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(task);
        }
      }}
      className={`bg-dark-700 rounded-xl border border-dark-600 p-4 cursor-grab active:cursor-grabbing transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 ${
        isCurrentlyDragging ? 'opacity-50 shadow-2xl ring-2 ring-purple-500' : ''
      } hover:border-dark-500`}
    >
      <h4 className="font-medium text-white mb-2 line-clamp-2">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <span className="flex items-center space-x-1" aria-label={`Due ${format(new Date(task.dueDate), 'MMM d')}`}>
              <Calendar size={12} aria-hidden="true" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </span>
          )}

          {task.assignees?.length > 0 && (
            <span className="flex items-center space-x-1" aria-label={`${task.assignees.length} assignee${task.assignees.length > 1 ? 's' : ''}`}>
              <Users size={12} aria-hidden="true" />
              <span>{task.assignees.length}</span>
            </span>
          )}
        </div>

        <button
          aria-label="More options"
          className="p-1 hover:bg-dark-600 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <MoreHorizontal size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Assignees avatars */}
      {task.assignees?.length > 0 && (
        <div className="flex -space-x-2 mt-3" role="group" aria-label="Assignees">
          {task.assignees.slice(0, 3).map((assignee, i) => (
            <div
              key={assignee._id || i}
              className="w-6 h-6 rounded-full bg-purple-400 border-2 border-dark-700 flex items-center justify-center text-xs text-white"
              title={assignee.username}
              aria-label={assignee.username}
            >
              {(assignee.username || 'U').charAt(0)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div
              className="w-6 h-6 rounded-full bg-dark-600 border-2 border-dark-700 flex items-center justify-center text-xs text-slate-400"
              aria-label={`${task.assignees.length - 3} more assignees`}
            >
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export const TaskCard = memo(TaskCardComponent);
export default TaskCard;