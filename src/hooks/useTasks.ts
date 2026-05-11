import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore.js';
import socketService from '../services/socket.js';
import { Task } from '../types';

export const useTasks = (workspaceId?: string) => {
  const {
    tasks,
    isLoading,
    error,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    reorderTasks,
    setFilters,
    clearFilters,
    getTasksByStatus,
    clearTasks,
    handleTaskCreated,
    handleTaskUpdated,
    handleTaskDeleted,
    handleTaskMoved,
    handleReordered
  } = useTaskStore();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!workspaceId) return;

    // Clear previous state when workspace changes
    clearTasks();

    const handleCreated = handleTaskCreated as Parameters<typeof socketService.onTaskCreated>[0];
    const handleUpdated = handleTaskUpdated as Parameters<typeof socketService.onTaskUpdated>[0];
    const handleDeleted = handleTaskDeleted as Parameters<typeof socketService.onTaskDeleted>[0];
    const handleMoved = handleTaskMoved as Parameters<typeof socketService.onTaskMoved>[0];
    const handleReorderedFn = handleReordered as Parameters<typeof socketService.onTaskReordered>[0];

    socketService.onTaskCreated(handleCreated);
    socketService.onTaskUpdated(handleUpdated);
    socketService.onTaskDeleted(handleDeleted);
    socketService.onTaskMoved(handleMoved);
    socketService.onTaskReordered(handleReorderedFn);

    initializedRef.current = true;

    return () => {
      socketService.onTaskCreated(() => {});
      socketService.onTaskUpdated(() => {});
      socketService.onTaskDeleted(() => {});
      socketService.onTaskMoved(() => {});
      socketService.onTaskReordered(() => {});
    };
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId && initializedRef.current) {
      fetchTasks(workspaceId, filters);
    }
  }, [filters]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    createTask: (data: { title: string; description?: string }) => createTask(workspaceId!, data),
    updateTask,
    deleteTask,
    updateTaskStatus,
    reorderTasks: (tasks: Task[]) => reorderTasks(workspaceId!, tasks),
    setFilters,
    clearFilters,
    getTasksByStatus,
    clearTasks
  };
};

export default useTasks;