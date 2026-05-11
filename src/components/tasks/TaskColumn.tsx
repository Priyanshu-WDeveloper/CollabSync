import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Task } from '../../types';

interface Column {
  id: string;
  title: string;
  color: string;
}

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ column, tasks, onTaskClick }) => {
  return (
    <div className="bg-dark-800/50 rounded-2xl border border-dark-600 p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${column.color}`} />
        <h3 className="font-semibold text-white">{column.title}</h3>
        <span className="ml-auto text-sm text-slate-500 bg-dark-700 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map(t => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[200px]">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onTaskClick} />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No tasks yet
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskColumn;