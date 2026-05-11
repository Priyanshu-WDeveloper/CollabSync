import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { Plus, Search, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks.js';
import { useKeyboardShortcuts, SHORTCUTS } from '../../hooks/index.js';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import { Button, Spinner } from '../ui/index.js';
import { TASK_STATUS, TASK_STATUS_LABELS, Task, TaskStatus } from '../../types';

interface KanbanBoardProps {
  workspaceId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ workspaceId }) => {
  const {
    tasks,
    isLoading,
    filters,
    setFilters,
    clearFilters,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    reorderTasks,
    getTasksByStatus
  } = useTasks(workspaceId);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => [
    {
      key: 'n',
      callback: () => setShowCreateModal(true),
      description: 'Create new task'
    },
    {
      key: '/',
      callback: () => searchInputRef.current?.focus(),
      description: 'Focus search'
    }
  ], []);

  useKeyboardShortcuts({ shortcuts });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const columns = useMemo(() => [
    { id: TASK_STATUS.TODO, title: TASK_STATUS_LABELS[TASK_STATUS.TODO], color: 'bg-slate-500' },
    { id: TASK_STATUS.IN_PROGRESS, title: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: 'bg-amber-500' },
    { id: TASK_STATUS.DONE, title: TASK_STATUS_LABELS[TASK_STATUS.DONE], color: 'bg-emerald-500' }
  ], []);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const getColumnTasks = useCallback((status: TaskStatus) => {
    return filteredTasks
      .filter(t => t.status === status)
      .sort((a, b) => a.order - b.order);
  }, [filteredTasks]);

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const overId = over.id;
    const isOverColumn = columns.some(c => c.id === overId);

    if (isOverColumn) {
      // Moving to a different column
      if (activeTask.status !== overId) {
        updateTaskStatus(active.id as string, overId as string);
      }
    } else {
      // Moving to another task
      const overTask = tasks.find(t => t._id === over.id);
      if (overTask && activeTask.status === overTask.status) {
        const columnTasks = getColumnTasks(activeTask.status);
        const oldIndex = columnTasks.findIndex(t => t._id === active.id);
        const newIndex = columnTasks.findIndex(t => t._id === over.id);

        if (oldIndex !== newIndex) {
          const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
          const updates = reorderedTasks.map((t, i) => ({
            ...t,
            order: i,
            status: activeTask.status
          }));
          reorderTasks(updates);
        }
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ search: value });
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-label="Kanban board">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <label htmlFor="task-search" className="sr-only">Search tasks</label>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="task-search"
            ref={searchInputRef}
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={(e) => setFilters({ status: (e.target.value || null) as TaskStatus | null })}
          className="px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>

        {filters.status && (
          <button
            onClick={clearFilters}
            aria-label="Clear filters"
            className="p-2.5 rounded-xl bg-dark-700 border border-dark-500 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        <Button onClick={() => setShowCreateModal(true)} className="ml-auto">
          <Plus size={18} className="mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.id as TaskStatus)}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} isDragging />
          )}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          workspaceId={workspaceId}
          onClose={() => setShowCreateModal(false)}
          onCreate={createTask}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={tasks.find(t => t._id === selectedTask._id) || selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
      )}
    </div>
  );
};

export default KanbanBoard;